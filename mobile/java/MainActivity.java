/**
 * Daily Fitness Tracker - MainActivity
 * Written by Brian McCarthy
 */
package com.example.dailyfitnesstracker;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private EditText stepsInput;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        stepsInput = findViewById(R.id.steps_input);
        Button calculateCaloriesButton = findViewById(R.id.calculate_calories_button);

        calculateCaloriesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String stepsText = stepsInput.getText().toString();
                if (stepsText.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Please enter your steps", Toast.LENGTH_SHORT).show();
                } else {
                    int steps = Integer.parseInt(stepsText);
                    Intent intent = new Intent(MainActivity.this, CaloriesActivity.class);
                    intent.putExtra("steps", steps);
                    startActivity(intent);
                }
            }
        });
    }
}
