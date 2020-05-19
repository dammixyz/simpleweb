<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Svengali StuNNer',
            'email' => 'stunner@gmail.com',
            'password' => Hash::make('12345678'),
            'photo' => 'profile.png',
            'type' => 'Admin',
            'bio' => 'StuNNer is a nice guy',
        ]);
    }
}
