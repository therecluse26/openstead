<?php

namespace App\Models;

use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Variety extends Model
{
	use HasFactory;

	protected $table = 'varieties';

	protected $fillable = [
		'kingdom',
		'group_type',
		'variety_name',
		'description',
	];

	public function livestock(): BelongsTo
	{
		return $this->belongsTo(Livestock::class, 'id', 'variety_id');
	}

	public function seeds(): BelongsTo
	{
		return $this->belongsTo(Seed::class, 'id', 'variety_id');
	}
}
