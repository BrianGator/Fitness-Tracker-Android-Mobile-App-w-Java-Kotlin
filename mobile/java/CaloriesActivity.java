/**
 * Daily Fitness Tracker - CaloriesActivity
 * Written by Brian McCarthy
 */
package com.example.dailyfitnesstracker;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class CaloriesActivity extends AppCompatActivity {
   private EditText weightInput;
   private EditText ageInput;
   private TextView caloriesBurned;

   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       setContentView(R.layout.activity_calories);

       weightInput = findViewById(R.id.weight_input);
       ageInput = findViewById(R.id.age_input);
       caloriesBurned = findViewById(R.id.calories_burned);

       Button calculateButton = findViewById(R.id.calculate_button);
       Button backButton = findViewById(R.id.back_button);

       calculateButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               int steps = getIntent().getIntExtra("steps", 0);
               if (steps == 0) {
                   Toast.makeText(CaloriesActivity.this, "Please enter steps in the main screen", Toast.LENGTH_SHORT).show();
                   finish();
                   return;
               }

               if (weightInput.getText().toString().isEmpty() || ageInput.getText().toString().isEmpty()) {
                   Toast.makeText(CaloriesActivity.this, "Enter weight and age", Toast.LENGTH_SHORT).show();
                   return;
               }

               int weight = Integer.parseInt(weightInput.getText().toString());
               int age = Integer.parseInt(ageInput.getText().toString());

               double calories = calculateCalories(weight, age, steps);
               caloriesBurned.setText("Calories Burned: " + Math.round(calories));
           }
       });

       backButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               finish();
           }
       });
   }

   private double calculateCalories(int weight, int age, int steps) {
       double met = 3.5;
       double stepsPerMile = 2000;
       double miles = steps / stepsPerMile;
       double ageFactor = 1 - (age - 20) * 0.001;
       return met * weight * miles * ageFactor;
   }
}
