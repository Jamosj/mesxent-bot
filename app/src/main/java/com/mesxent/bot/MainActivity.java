package com.mesxent.bot;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.castar.sdk.CastarSdk;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Final Step: Start the SDK for the advertising bot
        CastarSdk.init(this, "cskKRx4BCxbAUY");
        CastarSdk.loadCampaigns();
    }
}
