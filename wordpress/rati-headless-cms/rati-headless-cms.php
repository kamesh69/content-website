<?php
/**
 * Plugin Name: Rati Headless CMS
 * Description: Headless CMS integration for ratiiagrawal.com — CPTs, GraphQL fields, visual image media library editor, subscriber management, automated newsletter emails, and revalidation webhooks.
 * Version: 1.1.0
 * Author: Rati Agrawal
 * Requires Plugins: wp-graphql
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Rati_Headless_CMS {
    private const OPTION_KEY = 'rati_site_settings';
    private const CATEGORY_SLUG = 'rati-writing';

    public static function init(): void {
        add_action('init', [self::class, 'register_post_types']);
        add_action('init', [self::class, 'register_meta']);
        add_action('admin_menu', [self::class, 'register_admin_menu']);
        add_action('admin_init', [self::class, 'register_settings']);
        add_action('admin_enqueue_scripts', [self::class, 'enqueue_admin_assets']);
        add_action('save_post', [self::class, 'on_save_post'], 20, 3);
        add_action('transition_post_status', [self::class, 'on_post_status_transition'], 10, 3);
        add_action('updated_option', [self::class, 'on_settings_updated'], 10, 3);

        add_filter('preview_post_link', [self::class, 'filter_preview_link'], 10, 2);
        add_filter('post_link', [self::class, 'filter_post_link'], 10, 2);
        add_filter('page_link', [self::class, 'filter_page_link'], 10, 2);
        add_filter('post_type_link', [self::class, 'filter_cpt_link'], 10, 2);
        add_action('template_redirect', [self::class, 'redirect_public_frontend']);

        add_action('graphql_register_types', [self::class, 'register_graphql']);
        add_action('rest_api_init', [self::class, 'register_rest_routes']);

        add_filter('manage_post_posts_columns', [self::class, 'add_view_site_column']);
        add_filter('manage_page_posts_columns', [self::class, 'add_view_site_column']);
        add_action('manage_post_posts_custom_column', [self::class, 'render_view_site_column'], 10, 2);
        add_action('manage_page_posts_custom_column', [self::class, 'render_view_site_column'], 10, 2);
    }

    public static function frontend_url(): string {
        return rtrim((string) getenv('RATI_FRONTEND_URL') ?: (string) get_option('rati_frontend_url', 'https://www.ratiiagrawal.com'), '/');
    }

    public static function preview_secret(): string {
        return (string) getenv('RATI_PREVIEW_SECRET') ?: (string) get_option('rati_preview_secret', '');
    }

    public static function revalidate_secret(): string {
        return (string) getenv('RATI_REVALIDATE_SECRET') ?: (string) get_option('rati_revalidate_secret', '');
    }

    public static function revalidate_url(): string {
        return rtrim(self::frontend_url(), '/') . '/api/revalidate';
    }

    public static function enqueue_admin_assets(string $hook): void {
        if (strpos($hook, 'rati-site-content') !== false) {
            wp_enqueue_media();
        }
    }

    public static function register_post_types(): void {
        $common = [
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
            'capability_type' => 'post',
            'map_meta_cap' => true,
        ];

        register_post_type('rati_service', array_merge($common, [
            'labels' => ['name' => 'Services', 'singular_name' => 'Service'],
            'menu_icon' => 'dashicons-edit',
            'graphql_single_name' => 'RatiService',
            'graphql_plural_name' => 'RatiServices',
        ]));

        register_post_type('rati_project', array_merge($common, [
            'labels' => ['name' => 'Articles / Work', 'singular_name' => 'Article Item'],
            'menu_icon' => 'dashicons-portfolio',
            'graphql_single_name' => 'RatiProject',
            'graphql_plural_name' => 'RatiProjects',
        ]));

        register_post_type('rati_faq', array_merge($common, [
            'labels' => ['name' => 'FAQ', 'singular_name' => 'FAQ Item'],
            'menu_icon' => 'dashicons-editor-help',
            'graphql_single_name' => 'RatiFaq',
            'graphql_plural_name' => 'RatiFaqs',
        ]));

        register_post_type('rati_process_step', array_merge($common, [
            'labels' => ['name' => 'Process Steps', 'singular_name' => 'Process Step'],
            'menu_icon' => 'dashicons-list-view',
            'graphql_single_name' => 'RatiProcessStep',
            'graphql_plural_name' => 'RatiProcessSteps',
        ]));

        register_post_type('rati_start_here', array_merge($common, [
            'labels' => ['name' => 'Start Here Links', 'singular_name' => 'Start Here Link'],
            'menu_icon' => 'dashicons-admin-links',
            'graphql_single_name' => 'RatiStartHere',
            'graphql_plural_name' => 'RatiStartHeres',
        ]));

        register_post_type('rati_subscriber', [
            'labels' => ['name' => 'Newsletter Subscribers', 'singular_name' => 'Subscriber'],
            'public' => false,
            'show_ui' => false,
            'show_in_rest' => false,
            'supports' => ['title'],
            'capability_type' => 'post',
        ]);
    }

    public static function register_meta(): void {
        $fields = [
            'rati_service' => [
                'service_number' => 'string',
                'service_items' => 'string',
                'service_cta' => 'string',
                'service_href' => 'string',
                'sort_order' => 'integer',
            ],
            'rati_project' => [
                'project_category' => 'string',
                'project_type' => 'string',
                'project_description' => 'string',
                'project_href' => 'string',
                'project_featured' => 'boolean',
                'sort_order' => 'integer',
            ],
            'rati_faq' => [
                'sort_order' => 'integer',
            ],
            'rati_process_step' => [
                'step_number' => 'string',
                'sort_order' => 'integer',
            ],
            'rati_start_here' => [
                'link_category' => 'string',
                'link_href' => 'string',
                'sort_order' => 'integer',
            ],
            'post' => [
                'rati_quote' => 'string',
                'rati_closing' => 'string',
                'rati_reading_time' => 'string',
                'rati_sections' => 'string',
                'rati_hero_image_alt' => 'string',
            ],
            'page' => [],
        ];

        foreach ($fields as $object_type => $meta_fields) {
            foreach ($meta_fields as $key => $type) {
                register_post_meta($object_type, $key, [
                    'type' => $type === 'integer' ? 'integer' : ($type === 'boolean' ? 'boolean' : 'string'),
                    'single' => true,
                    'show_in_rest' => true,
                    'show_in_graphql' => true,
                    'auth_callback' => static fn () => current_user_can('edit_posts'),
                ]);
            }
        }
    }

    public static function register_admin_menu(): void {
        add_menu_page(
            'Rati Site Content',
            'Rati Site',
            'manage_options',
            'rati-site-content',
            [self::class, 'render_settings_page'],
            'dashicons-admin-home',
            3
        );

        add_submenu_page(
            'rati-site-content',
            'Newsletter Subscribers',
            'Subscribers',
            'manage_options',
            'rati-subscribers',
            [self::class, 'render_subscribers_page']
        );

        add_submenu_page(
            'rati-site-content',
            'Headless Settings',
            'Headless Settings',
            'manage_options',
            'rati-headless-settings',
            [self::class, 'render_headless_settings_page']
        );
    }

    public static function register_settings(): void {
        register_setting('rati_headless_settings', 'rati_frontend_url');
        register_setting('rati_headless_settings', 'rati_preview_secret');
        register_setting('rati_headless_settings', 'rati_revalidate_secret');
    }

    public static function default_site_settings(): array {
        return [
            'site' => [
                'name' => 'Rati Agrawal',
                'role' => 'Writer & Editor',
                'title' => 'Rati Agrawal — Writer & Editor',
                'description' => 'Writer, editor, and storyteller creating scripts, copy, and content people want to keep reading.',
                'email' => 'hello@ratiagrawal.com',
                'ogImage' => '/images/hero/desk.jpg',
            ],
            'hero' => [
                'eyebrow' => 'Writer · Editor · Storyteller',
                'headingLines' => ['I turn ideas into', 'words people want', 'to keep reading.'],
                'description' => "I'm a full-time writer and editor creating scripts, copy, and content that sound human, hold attention, and make complicated ideas easier to understand.",
                'image' => '/images/hero/desk.jpg',
                'imageAlt' => 'Rati Agrawal writing at a desk',
            ],
            'editorialStatement' => [],
            'servicesIntro' => [],
            'workIntro' => [],
            'behindTheWords' => [
                'image' => '/images/workspace/notes.jpg',
                'imageAlt' => 'Notebook, handwritten notes, coffee',
            ],
            'writingIntro' => [],
            'startHere' => [],
            'about' => [
                'image' => '/images/about/portrait.jpg',
                'imageAlt' => 'Portrait of Rati Agrawal',
            ],
            'processIntro' => [],
            'testimonial' => [],
            'faqIntro' => [],
            'newsletter' => [],
            'socialLinks' => [],
            'navigation' => [],
            'editorialNavigation' => [],
        ];
    }

    public static function get_site_settings(): array {
        $stored = get_option(self::OPTION_KEY, []);
        if (!is_array($stored)) {
            $stored = [];
        }
        return array_replace_recursive(self::default_site_settings(), $stored);
    }

    public static function render_settings_page(): void {
        if (!current_user_can('manage_options')) {
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && check_admin_referer('rati_site_settings_save')) {
            if (isset($_POST['rati_site_settings_form'])) {
                $current = self::get_site_settings();
                $posted = $_POST['site_fields'] ?? [];

                if (isset($posted['site'])) {
                    $current['site']['name'] = sanitize_text_field($posted['site']['name'] ?? '');
                    $current['site']['role'] = sanitize_text_field($posted['site']['role'] ?? '');
                    $current['site']['title'] = sanitize_text_field($posted['site']['title'] ?? '');
                    $current['site']['description'] = sanitize_textarea_field($posted['site']['description'] ?? '');
                    $current['site']['email'] = sanitize_email($posted['site']['email'] ?? '');
                    $current['site']['ogImage'] = esc_url_raw($posted['site']['ogImage'] ?? '');
                }

                if (isset($posted['hero'])) {
                    $current['hero']['image'] = esc_url_raw($posted['hero']['image'] ?? '');
                    $current['hero']['imageAlt'] = sanitize_text_field($posted['hero']['imageAlt'] ?? '');
                }

                if (isset($posted['about'])) {
                    $current['about']['image'] = esc_url_raw($posted['about']['image'] ?? '');
                    $current['about']['imageAlt'] = sanitize_text_field($posted['about']['imageAlt'] ?? '');
                }

                if (isset($posted['behindTheWords'])) {
                    $current['behindTheWords']['image'] = esc_url_raw($posted['behindTheWords']['image'] ?? '');
                    $current['behindTheWords']['imageAlt'] = sanitize_text_field($posted['behindTheWords']['imageAlt'] ?? '');
                }

                update_option(self::OPTION_KEY, $current);
                self::trigger_revalidation('site-settings');
                echo '<div class="notice notice-success"><p>Site content and metadata images updated successfully.</p></div>';
            } elseif (isset($_POST['rati_site_settings_json'])) {
                $raw = wp_unslash($_POST['rati_site_settings_json'] ?? '');
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    update_option(self::OPTION_KEY, $decoded);
                    self::trigger_revalidation('site-settings');
                    echo '<div class="notice notice-success"><p>Site content saved from JSON.</p></div>';
                } else {
                    echo '<div class="notice notice-error"><p>Invalid JSON. Nothing was saved.</p></div>';
                }
            }
        }

        $settings = self::get_site_settings();
        $settings_json = wp_json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        ?>
        <div class="wrap">
            <h1>Rati Site Content &amp; Media Management</h1>
            <p>Manage site copy, section images, and OpenGraph social metadata with WordPress Media Library integration.</p>

            <h2 class="nav-tab-wrapper">
                <a href="#tab-form" class="nav-tab nav-tab-active" onclick="switchTab(event, 'tab-form')">Visual Image &amp; Meta Editor</a>
                <a href="#tab-json" class="nav-tab" onclick="switchTab(event, 'tab-json')">Advanced JSON Editor</a>
            </h2>

            <div id="tab-form" class="tab-content" style="margin-top:20px;">
                <form method="post">
                    <?php wp_nonce_field('rati_site_settings_save'); ?>
                    <input type="hidden" name="rati_site_settings_form" value="1" />

                    <h3>1. Site Metadata &amp; OpenGraph Social Card Image</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Site Name</label></th>
                            <td><input type="text" class="regular-text" name="site_fields[site][name]" value="<?php echo esc_attr($settings['site']['name'] ?? ''); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label>Role / Subtitle</label></th>
                            <td><input type="text" class="regular-text" name="site_fields[site][role]" value="<?php echo esc_attr($settings['site']['role'] ?? ''); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label>SEO Title</label></th>
                            <td><input type="text" class="large-text" name="site_fields[site][title]" value="<?php echo esc_attr($settings['site']['title'] ?? ''); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label>SEO Description</label></th>
                            <td><textarea class="large-text" rows="3" name="site_fields[site][description]"><?php echo esc_textarea($settings['site']['description'] ?? ''); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row"><label>Contact Email</label></th>
                            <td><input type="email" class="regular-text" name="site_fields[site][email]" value="<?php echo esc_attr($settings['site']['email'] ?? ''); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label>Default OG / Share Image</label></th>
                            <td>
                                <div class="image-picker-wrap" style="display:flex;align-items:center;gap:15px;">
                                    <div class="preview-box" style="width:120px;height:80px;border:1px solid #ccc;background:#f9f9f9;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                                        <img id="og-image-preview" src="<?php echo esc_url($settings['site']['ogImage'] ?? '/images/hero/desk.jpg'); ?>" style="max-width:100%;max-height:100%;object-fit:cover;" />
                                    </div>
                                    <div>
                                        <input type="url" id="og-image-url" class="large-text" name="site_fields[site][ogImage]" value="<?php echo esc_attr($settings['site']['ogImage'] ?? ''); ?>" style="margin-bottom:8px;" />
                                        <br/>
                                        <button type="button" class="button rati-media-select" data-target-input="#og-image-url" data-target-preview="#og-image-preview">Select / Upload Image from Media Library</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <hr />

                    <h3>2. Section Images</h3>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Hero Section Image</label></th>
                            <td>
                                <div style="display:flex;align-items:center;gap:15px;margin-bottom:10px;">
                                    <div style="width:120px;height:80px;border:1px solid #ccc;background:#f9f9f9;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                                        <img id="hero-image-preview" src="<?php echo esc_url($settings['hero']['image'] ?? '/images/hero/desk.jpg'); ?>" style="max-width:100%;max-height:100%;object-fit:cover;" />
                                    </div>
                                    <div>
                                        <input type="url" id="hero-image-url" class="large-text" name="site_fields[hero][image]" value="<?php echo esc_attr($settings['hero']['image'] ?? ''); ?>" style="margin-bottom:6px;" />
                                        <br/>
                                        <button type="button" class="button rati-media-select" data-target-input="#hero-image-url" data-target-preview="#hero-image-preview">Select / Upload Hero Image</button>
                                    </div>
                                </div>
                                <input type="text" class="large-text" name="site_fields[hero][imageAlt]" placeholder="Hero Image Alt Text" value="<?php echo esc_attr($settings['hero']['imageAlt'] ?? ''); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>About Section Image</label></th>
                            <td>
                                <div style="display:flex;align-items:center;gap:15px;margin-bottom:10px;">
                                    <div style="width:120px;height:80px;border:1px solid #ccc;background:#f9f9f9;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                                        <img id="about-image-preview" src="<?php echo esc_url($settings['about']['image'] ?? '/images/about/portrait.jpg'); ?>" style="max-width:100%;max-height:100%;object-fit:cover;" />
                                    </div>
                                    <div>
                                        <input type="url" id="about-image-url" class="large-text" name="site_fields[about][image]" value="<?php echo esc_attr($settings['about']['image'] ?? ''); ?>" style="margin-bottom:6px;" />
                                        <br/>
                                        <button type="button" class="button rati-media-select" data-target-input="#about-image-url" data-target-preview="#about-image-preview">Select / Upload About Image</button>
                                    </div>
                                </div>
                                <input type="text" class="large-text" name="site_fields[about][imageAlt]" placeholder="About Image Alt Text" value="<?php echo esc_attr($settings['about']['imageAlt'] ?? ''); ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>Behind The Words Image</label></th>
                            <td>
                                <div style="display:flex;align-items:center;gap:15px;margin-bottom:10px;">
                                    <div style="width:120px;height:80px;border:1px solid #ccc;background:#f9f9f9;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                                        <img id="btw-image-preview" src="<?php echo esc_url($settings['behindTheWords']['image'] ?? '/images/workspace/notes.jpg'); ?>" style="max-width:100%;max-height:100%;object-fit:cover;" />
                                    </div>
                                    <div>
                                        <input type="url" id="btw-image-url" class="large-text" name="site_fields[behindTheWords][image]" value="<?php echo esc_attr($settings['behindTheWords']['image'] ?? ''); ?>" style="margin-bottom:6px;" />
                                        <br/>
                                        <button type="button" class="button rati-media-select" data-target-input="#btw-image-url" data-target-preview="#btw-image-preview">Select / Upload Image</button>
                                    </div>
                                </div>
                                <input type="text" class="large-text" name="site_fields[behindTheWords][imageAlt]" placeholder="Behind The Words Alt Text" value="<?php echo esc_attr($settings['behindTheWords']['imageAlt'] ?? ''); ?>" />
                            </td>
                        </tr>
                    </table>

                    <?php submit_button('Save Visual Content &amp; Media'); ?>
                </form>
            </div>

            <div id="tab-json" class="tab-content" style="display:none;margin-top:20px;">
                <form method="post">
                    <?php wp_nonce_field('rati_site_settings_save'); ?>
                    <textarea name="rati_site_settings_json" rows="30" style="width:100%;font-family:monospace;"><?php echo esc_textarea($settings_json); ?></textarea>
                    <?php submit_button('Save JSON Raw Data'); ?>
                </form>
            </div>
        </div>

        <script>
        function switchTab(evt, tabName) {
            evt.preventDefault();
            document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('nav-tab-active'));
            document.getElementById(tabName).style.display = 'block';
            evt.currentTarget.classList.add('nav-tab-active');
        }

        jQuery(document).ready(function($){
            var mediaUploader;
            $('.rati-media-select').click(function(e) {
                e.preventDefault();
                var button = $(this);
                var inputTarget = $(button.data('target-input'));
                var previewTarget = $(button.data('target-preview'));

                mediaUploader = wp.media({
                    title: 'Select Image',
                    button: { text: 'Use This Image' },
                    multiple: false
                });

                mediaUploader.on('select', function() {
                    var attachment = mediaUploader.state().get('selection').first().toJSON();
                    inputTarget.val(attachment.url);
                    previewTarget.attr('src', attachment.url);
                });

                mediaUploader.open();
            });
        });
        </script>
        <?php
    }

    public static function render_subscribers_page(): void {
        if (!current_user_can('manage_options')) {
            return;
        }

        $subscribers = get_posts([
            'post_type' => 'rati_subscriber',
            'post_status' => 'publish',
            'numberposts' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        ?>
        <div class="wrap">
            <h1>Newsletter Subscribers</h1>
            <p>Total Active Subscribers: <strong><?php echo count($subscribers); ?></strong></p>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th scope="col">Email Address</th>
                        <th scope="col">Subscribed At</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($subscribers)) : ?>
                        <tr><td colspan="2">No subscribers yet.</td></tr>
                    <?php else : ?>
                        <?php foreach ($subscribers as $sub) : ?>
                            <tr>
                                <td><strong><?php echo esc_html($sub->post_title); ?></strong></td>
                                <td><?php echo esc_html($sub->post_date); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public static function render_headless_settings_page(): void {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1>Headless Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('rati_headless_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="rati_frontend_url">Frontend URL</label></th>
                        <td><input type="url" class="regular-text" id="rati_frontend_url" name="rati_frontend_url" value="<?php echo esc_attr(get_option('rati_frontend_url', self::frontend_url())); ?>" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="rati_preview_secret">Preview Secret</label></th>
                        <td><input type="text" class="regular-text" id="rati_preview_secret" name="rati_preview_secret" value="<?php echo esc_attr(get_option('rati_preview_secret', '')); ?>" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="rati_revalidate_secret">Revalidate Secret</label></th>
                        <td><input type="text" class="regular-text" id="rati_revalidate_secret" name="rati_revalidate_secret" value="<?php echo esc_attr(get_option('rati_revalidate_secret', '')); ?>" /></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            <p>Preview URL pattern: <code><?php echo esc_html(self::frontend_url()); ?>/api/preview?secret=...&amp;slug=...</code></p>
            <p>Revalidate URL: <code><?php echo esc_html(self::revalidate_url()); ?></code></p>
        </div>
        <?php
    }

    public static function resolve_frontend_path(string $post_type, string $slug, ?WP_Post $post = null): ?string {
        switch ($post_type) {
            case 'post':
                return '/blog/' . $slug;
            case 'rati_project':
                return '/blog/' . $slug;
            case 'page':
                return '/' . $slug;
            default:
                return null;
        }
    }

    public static function filter_preview_link(string $link, WP_Post $post): string {
        $path = self::resolve_frontend_path($post->post_type, $post->post_name, $post);
        if (!$path) {
            return $link;
        }

        $secret = self::preview_secret();
        if ($secret === '') {
            return rtrim(self::frontend_url(), '/') . $path;
        }

        return add_query_arg(
            [
                'secret' => $secret,
                'slug' => $post->post_name,
                'type' => $post->post_type,
            ],
            rtrim(self::frontend_url(), '/') . '/api/preview'
        );
    }

    public static function filter_post_link(string $link, WP_Post $post): string {
        $path = self::resolve_frontend_path($post->post_type, $post->post_name, $post);
        return $path ? rtrim(self::frontend_url(), '/') . $path : $link;
    }

    public static function filter_page_link(string $link, int $post_id): string {
        $post = get_post($post_id);
        if (!$post instanceof WP_Post) {
            return $link;
        }
        $path = self::resolve_frontend_path('page', $post->post_name, $post);
        return $path ? rtrim(self::frontend_url(), '/') . $path : $link;
    }

    public static function filter_cpt_link(string $link, WP_Post $post): string {
        $path = self::resolve_frontend_path($post->post_type, $post->post_name, $post);
        return $path ? rtrim(self::frontend_url(), '/') . $path : $link;
    }

    public static function redirect_public_frontend(): void {
        if (is_admin() || wp_doing_ajax() || wp_doing_cron() || (defined('REST_REQUEST') && REST_REQUEST)) {
            return;
        }

        if (defined('GRAPHQL_HTTP_REQUEST') && GRAPHQL_HTTP_REQUEST) {
            return;
        }

        global $wp;
        $request = isset($wp->request) ? trim((string) $wp->request, '/') : '';

        if ($request === 'graphql' || str_starts_with($request, 'wp-json')) {
            return;
        }

        if (is_singular()) {
            $post = get_queried_object();
            if ($post instanceof WP_Post) {
                $path = self::resolve_frontend_path($post->post_type, $post->post_name, $post);
                if ($path) {
                    wp_safe_redirect(rtrim(self::frontend_url(), '/') . $path, 302);
                    exit;
                }
            }
        }

        if (!is_user_logged_in()) {
            wp_safe_redirect(self::frontend_url(), 302);
            exit;
        }
    }

    public static function add_view_site_column(array $columns): array {
        $columns['rati_view_site'] = 'Live Site';
        return $columns;
    }

    public static function render_view_site_column(string $column, int $post_id): void {
        if ($column !== 'rati_view_site') {
            return;
        }

        $post = get_post($post_id);
        if (!$post instanceof WP_Post) {
            return;
        }

        $path = self::resolve_frontend_path($post->post_type, $post->post_name, $post);
        if (!$path) {
            echo '&mdash;';
            return;
        }

        $url = rtrim(self::frontend_url(), '/') . $path;
        echo '<a href="' . esc_url($url) . '" target="_blank" rel="noopener noreferrer">View on site</a>';
    }

    public static function on_save_post(int $post_id, WP_Post $post, bool $update): void {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        $map = [
            'post' => 'posts',
            'page' => 'pages',
            'rati_service' => 'services',
            'rati_project' => 'projects',
            'rati_faq' => 'faq',
            'rati_process_step' => 'process',
            'rati_start_here' => 'start-here',
        ];

        if (!isset($map[$post->post_type])) {
            return;
        }

        self::trigger_revalidation($map[$post->post_type]);
    }

    public static function on_post_status_transition(string $new_status, string $old_status, WP_Post $post): void {
        if ($new_status !== 'publish' || $old_status === 'publish') {
            return;
        }

        if ($post->post_type !== 'post' && $post->post_type !== 'rati_project') {
            return;
        }

        self::send_newsletter_broadcast($post);
    }

    public static function send_newsletter_broadcast(WP_Post $post): void {
        $subscribers = get_posts([
            'post_type' => 'rati_subscriber',
            'post_status' => 'publish',
            'numberposts' => -1,
        ]);

        if (empty($subscribers)) {
            return;
        }

        $frontend = self::frontend_url();
        $article_url = $frontend . '/blog/' . $post->post_name;
        $title = get_the_title($post);
        $excerpt = get_the_excerpt($post) ?: wp_trim_words(strip_tags($post->post_content), 30);
        $featured_image_url = get_the_post_thumbnail_url($post, 'large') ?: '';

        $subject = 'New Article: ' . $title . ' — Rati Agrawal';

        $img_html = $featured_image_url ? '<p><img src="' . esc_url($featured_image_url) . '" alt="" style="max-width:100%;height:auto;border-radius:6px;margin:16px 0;" /></p>' : '';

        $html_content = '
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background-color:#fdfbf7;color:#222;padding:24px;">
          <div style="max-width:580px;margin:0 auto;background:#ffffff;padding:32px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
            <p style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#c0564e;font-weight:bold;margin-bottom:12px;">Notes from the desk</p>
            <h1 style="font-size:24px;line-height:1.3;margin-top:0;margin-bottom:16px;">' . esc_html($title) . '</h1>
            ' . $img_html . '
            <p style="font-size:16px;line-height:1.6;color:#444;">' . esc_html($excerpt) . '</p>
            <p style="margin-top:28px;margin-bottom:28px;">
              <a href="' . esc_url($article_url) . '" style="background-color:#c0564e;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:600;display:inline-block;">Read Full Article →</a>
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin-top:32px;" />
            <p style="font-size:12px;color:#888;text-align:center;">You received this because you subscribed on <a href="' . esc_url($frontend) . '" style="color:#666;">ratiiagrawal.com</a>.</p>
          </div>
        </body>
        </html>';

        $headers = ['Content-Type: text/html; charset=UTF-8'];

        foreach ($subscribers as $sub) {
            $to = trim($sub->post_title);
            if (is_email($to)) {
                wp_mail($to, $subject, $html_content, $headers);
            }
        }
    }

    public static function on_settings_updated(string $option, mixed $old, mixed $value): void {
        if ($option === self::OPTION_KEY) {
            self::trigger_revalidation('site-settings');
        }
    }

    public static function trigger_revalidation(string $tag): void {
        $secret = self::revalidate_secret();
        if ($secret === '') {
            return;
        }

        wp_remote_post(self::revalidate_url(), [
            'timeout' => 5,
            'headers' => [
                'Content-Type' => 'application/json',
                'x-revalidate-secret' => $secret,
            ],
            'body' => wp_json_encode(['tag' => $tag]),
        ]);
    }

    public static function register_rest_routes(): void {
        register_rest_route('rati/v1', '/site-settings', [
            'methods' => 'GET',
            'callback' => static fn () => self::get_site_settings(),
            'permission_callback' => static fn () => current_user_can('edit_posts'),
        ]);

        register_rest_route('rati/v1', '/site-settings', [
            'methods' => 'POST',
            'callback' => static function (WP_REST_Request $request) {
                $data = $request->get_json_params();
                if (!is_array($data)) {
                    return new WP_Error('invalid_json', 'Expected JSON object.', ['status' => 400]);
                }
                update_option(self::OPTION_KEY, $data);
                self::trigger_revalidation('site-settings');
                return self::get_site_settings();
            },
            'permission_callback' => static fn () => current_user_can('manage_options'),
        ]);

        register_rest_route('rati/v1', '/subscribe', [
            'methods' => 'POST',
            'callback' => static function (WP_REST_Request $request) {
                $params = $request->get_json_params();
                $email = sanitize_email($params['email'] ?? '');

                if (!$email || !is_email($email)) {
                    return new WP_Error('invalid_email', 'Please provide a valid email address.', ['status' => 400]);
                }

                $existing = get_posts([
                    'post_type' => 'rati_subscriber',
                    'title' => $email,
                    'post_status' => 'any',
                ]);

                if (empty($existing)) {
                    wp_insert_post([
                        'post_type' => 'rati_subscriber',
                        'post_title' => $email,
                        'post_status' => 'publish',
                    ]);
                }

                return ['success' => true, 'message' => 'Subscribed successfully.'];
            },
            'permission_callback' => '__return_true',
        ]);
    }

    public static function register_graphql(): void {
        if (!function_exists('register_graphql_object_type')) {
            return;
        }

        register_graphql_field('RootQuery', 'ratiSiteSettings', [
            'type' => 'String',
            'description' => 'JSON-encoded site settings for ratiiagrawal.com',
            'resolve' => static fn () => wp_json_encode(self::get_site_settings()),
        ]);

        self::register_cpt_graphql_fields('RatiService', [
            'serviceNumber' => ['meta' => 'service_number', 'type' => 'String'],
            'serviceItems' => ['meta' => 'service_items', 'type' => 'String'],
            'serviceCta' => ['meta' => 'service_cta', 'type' => 'String'],
            'serviceHref' => ['meta' => 'service_href', 'type' => 'String'],
            'sortOrder' => ['meta' => 'sort_order', 'type' => 'Int'],
        ]);

        self::register_cpt_graphql_fields('RatiProject', [
            'projectCategory' => ['meta' => 'project_category', 'type' => 'String'],
            'projectType' => ['meta' => 'project_type', 'type' => 'String'],
            'projectDescription' => ['meta' => 'project_description', 'type' => 'String'],
            'projectHref' => ['meta' => 'project_href', 'type' => 'String'],
            'projectFeatured' => ['meta' => 'project_featured', 'type' => 'Boolean'],
            'sortOrder' => ['meta' => 'sort_order', 'type' => 'Int'],
        ]);

        self::register_cpt_graphql_fields('RatiFaq', [
            'sortOrder' => ['meta' => 'sort_order', 'type' => 'Int'],
        ]);

        self::register_cpt_graphql_fields('RatiProcessStep', [
            'stepNumber' => ['meta' => 'step_number', 'type' => 'String'],
            'sortOrder' => ['meta' => 'sort_order', 'type' => 'Int'],
        ]);

        self::register_cpt_graphql_fields('RatiStartHere', [
            'linkCategory' => ['meta' => 'link_category', 'type' => 'String'],
            'linkHref' => ['meta' => 'link_href', 'type' => 'String'],
            'sortOrder' => ['meta' => 'sort_order', 'type' => 'Int'],
        ]);

        self::register_cpt_graphql_fields('Post', [
            'ratiQuote' => ['meta' => 'rati_quote', 'type' => 'String'],
            'ratiClosing' => ['meta' => 'rati_closing', 'type' => 'String'],
            'ratiReadingTime' => ['meta' => 'rati_reading_time', 'type' => 'String'],
            'ratiSections' => ['meta' => 'rati_sections', 'type' => 'String'],
            'ratiHeroImageAlt' => ['meta' => 'rati_hero_image_alt', 'type' => 'String'],
        ]);

        register_graphql_field('RootQuery', 'ratiPageBySlug', [
            'type' => 'Page',
            'args' => ['slug' => ['type' => 'String']],
            'resolve' => static function ($root, array $args) {
                $posts = get_posts([
                    'name' => $args['slug'],
                    'post_type' => 'page',
                    'post_status' => 'publish',
                    'numberposts' => 1,
                ]);
                return $posts[0] ?? null;
            },
        ]);
    }

    private static function register_cpt_graphql_fields(string $type, array $fields): void {
        foreach ($fields as $field_name => $config) {
            register_graphql_field($type, $field_name, [
                'type' => $config['type'],
                'resolve' => static function ($post) use ($config) {
                    $id = $post->databaseId ?? $post->ID ?? 0;
                    $value = get_post_meta((int) $id, $config['meta'], true);
                    if ($config['type'] === 'Int') {
                        return (int) $value;
                    }
                    if ($config['type'] === 'Boolean') {
                        return (bool) $value;
                    }
                    return (string) $value;
                },
            ]);
        }
    }
}

Rati_Headless_CMS::init();
