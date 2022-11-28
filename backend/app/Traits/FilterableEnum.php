<?php

namespace App\Traits;

trait FilterableEnum
{
	public function icon(): ?string
	{
		return null;
	}

	public function label(): ?string
	{
		return null;
	}

	public function description(): ?string
	{
		return null;
	}

	public function examples(): ?string
	{
		return null;
	}

	public function toFilter(): array
	{
		return ['key' => $this, 'label' => $this->label(), 'icon' => $this->icon(), 'description' => $this->description()];
	}

}