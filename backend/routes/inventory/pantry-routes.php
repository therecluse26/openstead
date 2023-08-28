<?php
use App\Services\RouteBuilderService;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\PantryController;

RouteBuilderService::buildTypeFilterRoute(PantryController::class);
Route::get('/filters', [PantryController::class, 'getFilters']);
Route::get('/{id}/similar', [PantryController::class, 'getSimilar'])->middleware('user-can:inventory:list');

Route::prefix('')->name('pantry.')->group(static function () {
    Route::get('/', [PantryController::class, 'index'])->middleware('user-can:inventory:list');
    Route::post('/', [PantryController::class, 'store'])->middleware('user-can:inventory:create');
    Route::put('/{id}', [PantryController::class, 'update'])->middleware('user-can:inventory:update');
    Route::get('/{id}', [PantryController::class, 'show'])->middleware('user-can:inventory:read');
    Route::delete('/{id}', [PantryController::class, 'destroy'])->middleware('user-can:inventory:delete');
});