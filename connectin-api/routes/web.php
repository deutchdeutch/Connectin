<?php

use Illuminate\Support\Facades\Route;

// route vers welcome.blade.php
Route::get('/', function () {
    return view('welcome');
});

// route pour que url change en changeant de page
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');