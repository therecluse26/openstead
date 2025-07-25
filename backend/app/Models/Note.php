<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Note extends Model
{
	use HasUlids, HasFactory, BelongsToTenant;

	protected $table = 'notes';

	protected $fillable = [
		'tenant_id',
		'note',
		'creator_id'
	];

	public function notable(): MorphTo
	{
		return $this->morphTo();
	}

	public function creator(): BelongsTo
	{
		return $this->belongsTo(User::class, 'creator_id');
	}

	public function __toString(): string
	{
		return $this->note;
	}
}
