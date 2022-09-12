<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livestock extends Model
{
    use HasFactory;

	protected $table = 'livestock';

	protected $fillable = [
		'type',
		'breed',
		'date_of_birth',
	];

}
