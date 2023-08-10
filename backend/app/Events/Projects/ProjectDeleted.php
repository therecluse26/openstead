<?php
namespace App\Events\Projects;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class ProjectDeleted extends ShouldBeStored
{
    public array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }
}