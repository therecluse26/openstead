<?php

namespace App\Models;

use App\Enums\ServiceType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
	use HasUlids, HasFactory;

	protected $table = 'services';

	protected $fillable = [
		'type',
		'title',
		'description',
	];

	protected $casts = [
		'type' => ServiceType::class
	];
}
