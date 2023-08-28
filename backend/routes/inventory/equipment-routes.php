<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\EquipmentController;

Route::get('/types', [EquipmentController::class, 'getTypes']);
Route::get('/filters', [EquipmentController::class, 'getFilters']);
Route::get('/{id}/similar', [EquipmentController::class, 'getSimilar'])->middleware('user-can:inventory:list');

Route::prefix('')->name('equipment.')->group(static function () {
    Route::get('/', [EquipmentController::class, 'index'])->middleware('user-can:inventory:list');
    Route::post('/', [EquipmentController::class, 'store'])->middleware('user-can:inventory:create');
    Route::get('/{id}', [EquipmentController::class, 'show'])->middleware('user-can:inventory:read');
    Route::put('/{id}', [EquipmentController::class, 'update'])->middleware('user-can:inventory:update');
    Route::delete('/{id}', [EquipmentController::class, 'destroy'])->middleware('user-can:inventory:delete');
});