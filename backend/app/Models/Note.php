<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Note extends Model
{
	use HasFactory;

	protected $table = 'notes';

	protected $fillable = [
		'note'
	];

	public function notable(): MorphTo
	{
		return $this->morphTo();
	}

	public function __toString(): string
	{
		return $this->note;
	}
}
