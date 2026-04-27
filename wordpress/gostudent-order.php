<?php
/**
 * Plugin Name: GoStudent Order Page
 * Description: A React-based order page UI integrated via shortcode [gostudent_order]
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class GoStudent_Order_Plugin {

    public function __construct() {
        add_shortcode('gostudent_order', array($this, 'render_shortcode'));
        add_action('rest_api_init', array($this, 'register_rest_endpoints'));
    }

    public function render_shortcode() {
        // Enqueue Vite assets
        $plugin_url = plugin_dir_url(__FILE__);
        
        // In a real scenario, you'd parse the manifest.json from Vite to get exact hashes.
        // For this demo, assuming standard vite build output naming.
        wp_enqueue_script(
            'gostudent-order-js',
            $plugin_url . 'dist/assets/index.js',
            array(),
            '1.0.0',
            true
        );

        wp_enqueue_style(
            'gostudent-order-css',
            $plugin_url . 'dist/assets/style.css',
            array(),
            '1.0.0'
        );

        // Pass API settings to React
        wp_localize_script('gostudent-order-js', 'gostudentApiSettings', array(
            'root' => esc_url_raw(rest_url('gostudent/v1')),
            'nonce' => wp_create_nonce('wp_rest')
        ));

        // Mount point for React
        return '<div id="root"></div>';
    }

    public function register_rest_endpoints() {
        register_rest_route('gostudent/v1', '/pricing', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_pricing'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route('gostudent/v1', '/orders', array(
            'methods' => 'POST',
            'callback' => array($this, 'submit_order'),
            'permission_callback' => '__return_true'
        ));
    }

    public function get_pricing() {
        // Return mock data for the test. In production, fetch from DB.
        $pricing = array(
            array("id" => "1", "months" => 3, "sessionsPerMonth" => 8, "pricePerSession" => 18),
            array("id" => "2", "months" => 6, "sessionsPerMonth" => 10, "pricePerSession" => 16),
            array("id" => "3", "months" => 12, "sessionsPerMonth" => 12, "pricePerSession" => 14)
        );
        return rest_ensure_response($pricing);
    }

    public function submit_order(WP_REST_Request $request) {
        $params = $request->get_json_params();
        
        // Basic validation
        if (empty($params['fullName']) || empty($params['email'])) {
            return new WP_Error('invalid_data', 'Missing required fields', array('status' => 400));
        }

        // Return success for demo
        return rest_ensure_response(array(
            'status' => 'success',
            'order_id' => wp_generate_password(8, false),
            'message' => 'Order received successfully'
        ));
    }
}

new GoStudent_Order_Plugin();
