<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Equipment extends Model
{
    use HasFactory;

	protected $table = 'equipment';

	protected $fillable = [
		'name',
		'type',
		'condition',
		'description'
	];

	public function inventory(): MorphMany
	{
		return $this->morphMany(LocationInventory::class, 'inventoriable');
	}

	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}
}
