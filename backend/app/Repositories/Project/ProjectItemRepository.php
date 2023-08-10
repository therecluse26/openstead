<?php
namespace App\Repositories\Project;

use App\Contracts\Repository;
use App\Models\Projects\ProjectItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ProjectItemRepository implements Repository
{
    protected ProjectItem $model;
    
    public function __construct()
    {
        $this->model = new ProjectItem();
    }

    public function __call(string $method, array $arguments): mixed
    {
        return $this->model->$method(...$arguments);
    }

    public function count(): int
    {
        return $this->model->count();
    }

    public function getModel(): Model
    {
        return $this->model;
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function getById(string $id): ProjectItem
    {
        return $this->model->findOrFail($id);
    }

    public function getProjectItem(string $project_id, string $id): ProjectItem
    {
        $item = $this->getById($id);
        if($item->project_id !== $project_id) {
            throw new \Exception('Item does not belong to project');
        }
        return $item;    
    }

    public function create(array $attributes): ProjectItem
    {
        return $this->model->create($attributes);
    }
    
    public function update(string $project_id, string $id, array $attributes): bool
    {
        return $this->getProjectItem($project_id, $id)->update($attributes);
    }
    
    public function delete(string $project_id, string $id): bool
    {
        return $this->getProjectItem($project_id, $id)->delete();
    }

}