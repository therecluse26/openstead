<?php

namespace App\Models;

use App\Casts\VarietyType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variety extends Model
{
	use HasUlids, HasFactory;

	protected $table = 'varieties';

	protected $fillable = [
		'group',
		'group_type',
		'variety_name',
		'description',
	];

	protected $casts = [
		'group_type' => VarietyType::class
	];

	public function getTypeDescriptionAttribute()
	{
		return $this->group_type->toFilter();
	}
}
