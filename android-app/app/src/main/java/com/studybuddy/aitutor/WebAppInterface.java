package com.studybuddy.aitutor;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * JavaScript Interface for StudyBuddy WebView
 * Provides native Android functionality to the web application
 */
public class WebAppInterface {
    
    private Context context;

    public WebAppInterface(Context context) {
        this.context = context;
    }

    /**
     * Show a toast message from JavaScript
     */
    @JavascriptInterface
    public void showToast(String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    /**
     * Show a long toast message from JavaScript
     */
    @JavascriptInterface
    public void showLongToast(String message) {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show();
    }

    /**
     * Vibrate the device
     */
    @JavascriptInterface
    public void vibrate(int duration) {
        try {
            Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                vibrator.vibrate(duration);
            }
        } catch (Exception e) {
            // Vibration not available
        }
    }

    /**
     * Share content using Android's native share dialog
     */
    @JavascriptInterface
    public void shareContent(String title, String text, String url) {
        try {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, title);
            shareIntent.putExtra(Intent.EXTRA_TEXT, text + "\n" + url);
            
            Intent chooser = Intent.createChooser(shareIntent, "Share StudyBuddy");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(chooser);
        } catch (Exception e) {
            showToast("Sharing not available");
        }
    }

    /**
     * Open external URL in browser
     */
    @JavascriptInterface
    public void openExternalUrl(String url) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } catch (Exception e) {
            showToast("Cannot open URL");
        }
    }

    /**
     * Get app version
     */
    @JavascriptInterface
    public String getAppVersion() {
        try {
            return context.getPackageManager()
                .getPackageInfo(context.getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "1.0";
        }
    }

    /**
     * Check if device has camera
     */
    @JavascriptInterface
    public boolean hasCamera() {
        return context.getPackageManager().hasSystemFeature("android.hardware.camera");
    }

    /**
     * Check if device has microphone
     */
    @JavascriptInterface
    public boolean hasMicrophone() {
        return context.getPackageManager().hasSystemFeature("android.hardware.microphone");
    }

    /**
     * Get device info for analytics
     */
    @JavascriptInterface
    public String getDeviceInfo() {
        return "Android/" + android.os.Build.VERSION.RELEASE + 
               " Model/" + android.os.Build.MODEL;
    }
}