<?php
namespace App\Projectors;

use App\Events\Projects\ProjectItemUpdated;
use App\Models\Projects\ProjectItem;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use App\Events\Projects\ProjectItemCreated;
use App\Events\Projects\ProjectItemDeleted;

class ProjectItemProjector extends Projector
{
    public function onItemCreated(ProjectItemCreated $event)
    {
        (new ProjectItem($event->attributes))->writeable()->save();
    }

    public function onUpdated(ProjectItemUpdated $event)
    {
        ProjectItem::find($event->attributes['id'])->writeable()->update($event->attributes);
    }

    public function onItemDeleted(ProjectItemDeleted $event)
    {
        ProjectItem::find($event->attributes['id'])->writeable()->delete();
    }
}