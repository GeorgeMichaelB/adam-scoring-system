<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Teacher Adam',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
        ]);

        $defaultStudents = [
            ['name' => 'Adam El-Bar (آدم)', 'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Adam', 'total_score' => 45],
            ['name' => 'Sara (سارة)', 'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sara', 'total_score' => 38],
            ['name' => 'Omar (عمر)', 'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Omar', 'total_score' => 52],
            ['name' => 'Mariam (مريم)', 'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mariam', 'total_score' => 29],
            ['name' => 'Youssef (يوسف)', 'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Youssef', 'total_score' => 41],
            ['name' => 'Lina (لينا)', 'avatar_url' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lina', 'total_score' => 33],
        ];

        foreach ($defaultStudents as $studentData) {
            \App\Models\Student::create($studentData);
        }
    }
}
