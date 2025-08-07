package com.studybuddy.aitutor;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreen;

/**
 * Splash Screen Activity for StudyBuddy
 * Shows app logo and loading animation before launching main WebView
 */
public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION = 3000; // 3 seconds
    private ImageView logoImageView;
    private TextView appNameTextView;
    private TextView loadingTextView;
    private Handler handler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Install splash screen
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        
        super.onCreate(savedInstanceState);
        
        // Make activity full screen
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        
        setContentView(R.layout.activity_splash);
        
        initViews();
        startAnimations();
        
        // Keep splash screen on screen longer
        splashScreen.setKeepOnScreenCondition(() -> true);
        
        // Transition to main activity after delay
        handler = new Handler(Looper.getMainLooper());
        handler.postDelayed(this::launchMainActivity, SPLASH_DURATION);
    }

    private void initViews() {
        logoImageView = findViewById(R.id.logo_image);
        appNameTextView = findViewById(R.id.app_name_text);
        loadingTextView = findViewById(R.id.loading_text);
    }

    private void startAnimations() {
        // Fade in animation for logo
        Animation fadeInLogo = AnimationUtils.loadAnimation(this, R.anim.fade_in);
        logoImageView.startAnimation(fadeInLogo);

        // Slide up animation for app name
        Animation slideUpName = AnimationUtils.loadAnimation(this, R.anim.slide_up);
        slideUpName.setStartOffset(500); // Start after 0.5 seconds
        appNameTextView.startAnimation(slideUpName);

        // Pulse animation for loading text
        Animation pulseLoading = AnimationUtils.loadAnimation(this, R.anim.pulse);
        pulseLoading.setStartOffset(1000); // Start after 1 second
        loadingTextView.startAnimation(pulseLoading);
    }

    private void launchMainActivity() {
        Intent intent = new Intent(SplashActivity.this, MainActivity.class);
        startActivity(intent);
        
        // Custom transition animation
        overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
        
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
        }
    }

    @Override
    public void onBackPressed() {
        // Disable back button on splash screen
        // Do nothing
    }
}