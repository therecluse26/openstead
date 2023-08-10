<?php
namespace App\Events\Projects;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class ProjectItemDeleted extends ShouldBeStored
{
    public array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }
}