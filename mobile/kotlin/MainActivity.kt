/**
 * Daily Fitness Tracker - MainActivity (Kotlin)
 * Written by Brian McCarthy
 */
package com.example.dailyfitnesstracker

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var stepsInput: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        stepsInput = findViewById(R.id.steps_input)
        val calculateCaloriesButton = findViewById<Button>(R.id.calculate_calories_button)

        calculateCaloriesButton.setOnClickListener {
            val stepsText = stepsInput.text.toString()
            if (stepsText.isEmpty()) {
                Toast.makeText(this, "Please enter your steps", Toast.LENGTH_SHORT).show()
            } else {
                val steps = stepsText.toInt()
                val intent = Intent(this, CaloriesActivity::class.java).apply {
                    putExtra("steps", steps)
                }
                startActivity(intent)
            }
        }
    }
}
