/**
 * Daily Fitness Tracker - CaloriesActivity (Kotlin)
 * Written by Brian McCarthy
 */
package com.example.dailyfitnesstracker

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlin.math.round

class CaloriesActivity : AppCompatActivity() {
    private lateinit var weightInput: EditText
    private lateinit var ageInput: EditText
    private lateinit var caloriesBurned: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_calories)

        weightInput = findViewById(R.id.weight_input)
        ageInput = findViewById(R.id.age_input)
        caloriesBurned = findViewById(R.id.calories_burned)

        val calculateButton = findViewById<Button>(R.id.calculate_button)
        val backButton = findViewById<Button>(R.id.back_button)

        calculateButton.setOnClickListener {
            val steps = intent.getIntExtra("steps", 0)
            if (steps == 0) {
                Toast.makeText(this, "Please enter steps in the main screen", Toast.LENGTH_SHORT).show()
                finish()
                return@setOnClickListener
            }

            val weightText = weightInput.text.toString()
            val ageText = ageInput.text.toString()

            if (weightText.isEmpty() || ageText.isEmpty()) {
                Toast.makeText(this, "Enter weight and age", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val weight = weightText.toInt()
            val age = ageText.toInt()

            val calories = calculateCalories(weight, age, steps)
            caloriesBurned.text = "Calories Burned: ${round(calories).toInt()}"
        }

        backButton.setOnClickListener {
            finish()
        }
    }

    private fun calculateCalories(weight: Int, age: Int, steps: Int): Double {
        val met = 3.5
        val stepsPerMile = 2000.0
        val miles = steps / stepsPerMile
        val ageFactor = 1 - (age - 20) * 0.001
        return met * weight * miles * ageFactor
    }
}
