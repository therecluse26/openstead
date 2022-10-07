<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
	use HasFactory;

	protected $table = 'locations';

	protected $fillable = [
		'primary',
		'name',
		'description',
		'address1',
		'address2',
		'city',
		'state',
		'zip',
		'country'
	];

	protected $casts = [
		'primary' => 'boolean'
	];
}
