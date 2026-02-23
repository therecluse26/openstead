# Issue #25: Plant Database/API Integration

**Priority:** 🔵 LOW (Enhances Seed/Garden Features)
**Complexity:** Medium-Hard
**Estimated Time:** 12-20 hours
**Status:** Not Started

## Overview

Integrate with open-source plant databases/APIs to provide rich plant information for seed inventory, garden planning, planting reminders, and more. Implement a strategy pattern to consume multiple plant APIs and cache results in a local database shared across all users.

## Goals

1. **Centralized Plant Data** - Access comprehensive plant information (varieties, growing zones, care instructions)
2. **Multi-API Strategy** - Support multiple plant APIs, allow users to search different databases
3. **Shared Database** - Cache plant data locally to reduce API calls and share across tenants
4. **Prevent Bad Data** - Remove ability for users to manually add varieties (or make it admin-only)
5. **Integration with Modules** - Use plant data in seed inventory, garden planning, calendar (planting dates)

## Plant API Options

### Research Summary (Need to Verify)

**Option A: Trefle API** (https://trefle.io/)
- Comprehensive plant database (500k+ species)
- Free tier: 120 requests/day
- Paid tier: Higher limits
- RESTful API, JSON responses
- Data: Scientific name, common names, images, growing zones, care requirements

**Option B: USDA Plants Database** (https://plants.usda.gov/)
- Official US government database
- Free, no API key required
- Data: Scientific names, characteristics, distributions
- Web scraping may be required (no official JSON API)

**Option C: OpenFarm** (https://openfarm.cc/)
- Open-source, community-driven
- Free, public API
- Focus on food crops
- Data: Growing guides, companions, images

**Option D: PermaData** / Custom Scrapers
- Scrape multiple sources
- More control, more maintenance

**Option E: PlantzAfrica / Others**
- Regional databases

**Recommendation:** Start with Trefle (comprehensive, good API), add OpenFarm as secondary source.

## Architecture: Strategy Pattern

Use the strategy pattern to abstract plant API interactions:
- Interface: `PlantDataProviderInterface`
- Implementations: `TreflePlantProvider`, `OpenFarmPlantProvider`, `USDAPlantProvider`
- Service: `PlantDataService` orchestrates providers
- Users can search across multiple providers

## Implementation Plan

### Phase 1: Research & API Selection

- [ ] Sign up for Trefle API (get API key)
- [ ] Test Trefle API endpoints with Postman/curl
- [ ] Review OpenFarm API documentation
- [ ] Decide which APIs to support in MVP (recommend: Trefle + OpenFarm)
- [ ] Document API response schemas for each provider

### Phase 2: Database Schema - Local Plant Cache

- [ ] Create migration: `create_plant_varieties_table`
  - [ ] `id` (ULID primary key)
  - [ ] `source` (enum: 'trefle', 'openfarm', 'usda', 'manual') - Where data came from
  - [ ] `source_id` (string) - External API ID
  - [ ] `scientific_name` (string) - e.g., "Solanum lycopersicum"
  - [ ] `common_name` (string) - e.g., "Tomato"
  - [ ] `family` (string, nullable) - e.g., "Solanaceae"
  - [ ] `description` (text, nullable) - Plant description
  - [ ] `image_url` (string, nullable) - Primary image
  - [ ] `data` (JSON) - Full API response cached
  - [ ] `created_at`, `updated_at`
  - [ ] Indexes: `source`, `source_id`, `scientific_name`, `common_name`
  - [ ] Unique constraint on `[source, source_id]`

- [ ] Create model: `/backend/app/Models/PlantVariety.php`
  - [ ] Use `HasUlids`
  - [ ] Cast `data` as `array`
  - [ ] Scope: `scopeBySource($query, $source)` - Filter by API source
  - [ ] Scope: `scopeSearch($query, $term)` - Search by name
  - [ ] Method: `getGrowingInfo()` - Extract growing data from JSON
  - [ ] Method: `getCareInstructions()` - Extract care info from JSON

**Note:** Plant varieties are NOT tenant-scoped (shared across all users)

### Phase 3: Plant Data Provider Interface

- [ ] Create interface: `/backend/app/Contracts/PlantDataProvider.php`
  ```php
  interface PlantDataProvider
  {
      public function search(string $query): Collection;
      public function getById(string $id): ?array;
      public function getName(): string; // Provider name (e.g., "Trefle")
  }
  ```

### Phase 4: Trefle API Provider

- [ ] Create provider: `/backend/app/Services/PlantProviders/TreflePlantProvider.php`
  - [ ] Implement `PlantDataProvider` interface
  - [ ] Use Guzzle HTTP client to call Trefle API
  - [ ] Method: `search(string $query)` - Search plants by name
    - Call: `GET https://trefle.io/api/v1/plants?token={key}&filter[common_name]={query}`
    - Parse JSON response
    - Return collection of plant data
  - [ ] Method: `getById(string $id)` - Get plant details
    - Call: `GET https://trefle.io/api/v1/plants/{id}?token={key}`
    - Return plant data array
  - [ ] Handle API errors, rate limits
  - [ ] Cache responses (use Laravel cache for API responses)

**Example Implementation:**
```php
use Illuminate\Support\Facades\Http;

class TreflePlantProvider implements PlantDataProvider
{
    protected string $apiKey;
    protected string $baseUrl = 'https://trefle.io/api/v1';

    public function __construct()
    {
        $this->apiKey = config('services.trefle.api_key');
    }

    public function search(string $query): Collection
    {
        $cacheKey = "trefle_search_{$query}";

        return Cache::remember($cacheKey, 3600, function() use ($query) {
            $response = Http::get("{$this->baseUrl}/plants", [
                'token' => $this->apiKey,
                'filter[common_name]' => $query,
            ]);

            if (!$response->successful()) {
                throw new \Exception('Trefle API request failed');
            }

            $plants = $response->json('data', []);

            return collect($plants)->map(function($plant) {
                return [
                    'source' => 'trefle',
                    'source_id' => $plant['id'],
                    'scientific_name' => $plant['scientific_name'],
                    'common_name' => $plant['common_name'],
                    'family' => $plant['family'] ?? null,
                    'image_url' => $plant['image_url'] ?? null,
                    'data' => $plant,
                ];
            });
        });
    }

    public function getById(string $id): ?array
    {
        // Similar to search, but fetch single plant
    }

    public function getName(): string
    {
        return 'Trefle';
    }
}
```

- [ ] Add Trefle API key to `.env`:
  ```env
  TREFLE_API_KEY=your_api_key_here
  ```

- [ ] Add to `/backend/config/services.php`:
  ```php
  'trefle' => [
      'api_key' => env('TREFLE_API_KEY'),
  ],
  ```

### Phase 5: OpenFarm API Provider

- [ ] Create provider: `/backend/app/Services/PlantProviders/OpenFarmPlantProvider.php`
  - [ ] Implement `PlantDataProvider` interface
  - [ ] Call OpenFarm API endpoints
  - [ ] Parse response format (different from Trefle)
  - [ ] Normalize data to common format

### Phase 6: Plant Data Service (Orchestrator)

- [ ] Create service: `/backend/app/Services/PlantDataService.php`
  - [ ] Register all plant providers (Trefle, OpenFarm, etc.)
  - [ ] Method: `searchAllProviders(string $query): Collection` - Search all APIs, merge results
  - [ ] Method: `searchProvider(string $provider, string $query): Collection` - Search specific API
  - [ ] Method: `savePlant(array $plantData): PlantVariety` - Cache plant in local database
  - [ ] Method: `getLocalPlants(string $query): Collection` - Search cached plants

**Example:**
```php
class PlantDataService
{
    protected array $providers = [];

    public function __construct(
        TreflePlantProvider $trefle,
        OpenFarmPlantProvider $openFarm
    ) {
        $this->providers = [
            'trefle' => $trefle,
            'openfarm' => $openFarm,
        ];
    }

    public function searchAllProviders(string $query): Collection
    {
        $results = collect([]);

        foreach ($this->providers as $name => $provider) {
            try {
                $providerResults = $provider->search($query);
                $results = $results->merge($providerResults);
            } catch (\Exception $e) {
                Log::error("Plant provider {$name} failed: " . $e->getMessage());
            }
        }

        return $results;
    }

    public function savePlant(array $plantData): PlantVariety
    {
        return PlantVariety::updateOrCreate(
            [
                'source' => $plantData['source'],
                'source_id' => $plantData['source_id'],
            ],
            $plantData
        );
    }

    public function getLocalPlants(string $query): Collection
    {
        return PlantVariety::search($query)->get();
    }
}
```

### Phase 7: Backend API - Plant Search

- [ ] Create controller: `/backend/app/Http/Controllers/Plants/PlantSearchController.php`
  - [ ] `search(Request $request)` - Search plants
    - Query params: `q` (search term), `source` (optional, specific API)
    - First search local cache
    - If no results, search external APIs
    - Return merged results
  - [ ] `show($id)` - Get plant details (from cache or API)
  - [ ] `save(Request $request)` - Save plant to local cache
    - Used when user selects a plant from search results

**Controller Example:**
```php
class PlantSearchController extends Controller
{
    public function search(Request $request, PlantDataService $plantService)
    {
        $query = $request->input('q');
        $source = $request->input('source'); // Optional: 'trefle', 'openfarm', or null (all)

        // Search local cache first
        $localResults = $plantService->getLocalPlants($query);

        if ($localResults->isNotEmpty()) {
            return response()->json([
                'source' => 'local',
                'results' => $localResults,
            ]);
        }

        // Search external APIs
        $externalResults = $source
            ? $plantService->searchProvider($source, $query)
            : $plantService->searchAllProviders($query);

        return response()->json([
            'source' => 'external',
            'results' => $externalResults,
        ]);
    }

    public function save(Request $request, PlantDataService $plantService)
    {
        $request->validate([
            'source' => 'required|string',
            'source_id' => 'required|string',
            'scientific_name' => 'required|string',
            'common_name' => 'required|string',
            'data' => 'required|array',
        ]);

        $plant = $plantService->savePlant($request->all());

        return response()->json([
            'plant' => $plant,
            'message' => 'Plant saved to library',
        ]);
    }
}
```

- [ ] Create routes: `/backend/routes/plants/plant-search-routes.php`
  ```php
  Route::get('/search', [PlantSearchController::class, 'search']);
  Route::get('/{id}', [PlantSearchController::class, 'show']);
  Route::post('/save', [PlantSearchController::class, 'save']);
  ```

- [ ] Register in `/backend/routes/api.php`:
  ```php
  Route::prefix('/plants')->middleware(['auth:sanctum'])
      ->group(base_path('routes/plants/plant-search-routes.php'));
  ```

### Phase 8: Integrate with Seed Inventory

- [ ] Update `seeds` table (migration: `add_plant_variety_id_to_seeds_table`):
  - [ ] `plant_variety_id` (string, nullable, foreign key to plant_varieties)

- [ ] Update `Seed` model:
  - [ ] Relationship: `belongsTo(PlantVariety::class, 'plant_variety_id')`
  - [ ] When plant variety is linked, display rich plant info in seed detail pages

- [ ] Update seed creation/editing forms:
  - [ ] Add plant search autocomplete
  - [ ] User types plant name → Search plant APIs → Select plant → Link to seed

### Phase 9: Frontend Service

- [ ] Create service: `/frontend/src/services/PlantService.js`
  ```javascript
  class PlantService {
      static async search(query, source = null) {
          return axios.get('/api/plants/search', {
              params: { q: query, source }
          });
      }

      static async getById(id) {
          return axios.get(`/api/plants/${id}`);
      }

      static async savePlant(plantData) {
          return axios.post('/api/plants/save', plantData);
      }
  }
  ```

### Phase 10: Frontend - Plant Search Component

- [ ] Create component: `/frontend/src/components/Plants/PlantSearchAutocomplete.js`
  - [ ] AutoComplete input (PrimeReact AutoComplete)
  - [ ] As user types, debounce and search plant APIs
  - [ ] Display results with:
    - Common name
    - Scientific name
    - Source (Trefle, OpenFarm, Local)
    - Thumbnail image
  - [ ] On select: Return selected plant data to parent
  - [ ] On select: Auto-save plant to local cache

**Example:**
```jsx
import { AutoComplete } from 'primereact/autocomplete';

const PlantSearchAutocomplete = ({ onSelect, value }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchPlants = async (event) => {
        setLoading(true);
        const res = await PlantService.search(event.query);
        setSuggestions(res.data.results);
        setLoading(false);
    };

    const handleSelect = async (e) => {
        const plant = e.value;

        // Save to local cache
        if (plant.source !== 'local') {
            await PlantService.savePlant(plant);
        }

        onSelect(plant);
    };

    const itemTemplate = (item) => (
        <div className="flex align-items-center gap-2">
            {item.image_url && <img src={item.image_url} alt={item.common_name} style={{ width: '40px' }} />}
            <div>
                <div><strong>{item.common_name}</strong></div>
                <div className="text-sm text-gray-500">{item.scientific_name}</div>
            </div>
            <Tag value={item.source} severity={item.source === 'local' ? 'success' : 'info'} />
        </div>
    );

    return (
        <AutoComplete
            value={value}
            suggestions={suggestions}
            completeMethod={searchPlants}
            onChange={(e) => onSelect(e.value)}
            onSelect={handleSelect}
            itemTemplate={itemTemplate}
            placeholder="Search for a plant..."
            loading={loading}
        />
    );
};
```

### Phase 11: Frontend - Seed Form Integration

- [ ] Update `/frontend/src/forms/Seeds/SeedForm.js`
  - [ ] Replace manual variety input with PlantSearchAutocomplete
  - [ ] Store selected plant_variety_id when saving seed
  - [ ] Display plant information alongside seed data

**Form Update:**
```jsx
const SeedForm = ({ mode, id }) => {
    const { control, setValue } = useForm();
    const [selectedPlant, setSelectedPlant] = useState(null);

    const handlePlantSelect = (plant) => {
        setSelectedPlant(plant);
        setValue('plant_variety_id', plant.id);
        setValue('variety_name', plant.common_name); // Pre-fill if needed
    };

    return (
        <form>
            <div className="field">
                <label>Plant Variety</label>
                <PlantSearchAutocomplete
                    value={selectedPlant}
                    onSelect={handlePlantSelect}
                />
            </div>

            {selectedPlant && (
                <Card>
                    <h4>{selectedPlant.common_name}</h4>
                    <p><em>{selectedPlant.scientific_name}</em></p>
                    {selectedPlant.image_url && <img src={selectedPlant.image_url} style={{ width: '200px' }} />}
                    {/* Display growing info, care instructions, etc. */}
                </Card>
            )}

            {/* Other seed form fields */}
        </form>
    );
};
```

### Phase 12: Display Plant Information

- [ ] Create component: `/frontend/src/components/Plants/PlantInfoCard.js`
  - [ ] Display plant details (name, family, description, image)
  - [ ] Display growing information (zones, sun requirements, water needs)
  - [ ] Display care instructions
  - [ ] Link to external sources (Trefle, OpenFarm)

- [ ] Show PlantInfoCard in:
  - [ ] Seed detail page (if plant variety linked)
  - [ ] Garden planning module (future)

### Phase 13: Prevent Manual Variety Creation (Optional)

- [ ] Remove manual variety input from seed forms
- [ ] Force users to select from plant database
- [ ] Or: Make manual input admin-only (add permission check)

**Rationale:** Prevents bad data, ensures data quality, leverages rich plant information.

### Phase 14: Garden Planning Integration (Future)

- [ ] Use plant data for garden layout planning
- [ ] Companion planting suggestions (from OpenFarm)
- [ ] Spacing requirements (from plant data)
- [ ] Seasonal planting calendar (from growing zones)

### Phase 15: Testing

- [ ] Backend Testing
  - [ ] Test Trefle API provider (mock API responses)
  - [ ] Test OpenFarm API provider
  - [ ] Test PlantDataService.searchAllProviders()
  - [ ] Test PlantDataService.savePlant()
  - [ ] Test plant search API endpoint
  - [ ] Test plant save API endpoint
  - [ ] Test local cache query performance

- [ ] Frontend Testing
  - [ ] Test PlantSearchAutocomplete component
  - [ ] Test autocomplete debounce (doesn't spam API)
  - [ ] Test plant selection and save to cache
  - [ ] Test seed form with plant search
  - [ ] Test PlantInfoCard displays correctly

- [ ] Integration Testing
  - [ ] Full flow: User searches plant → Selects → Saves to cache → Creates seed → Plant info displays
  - [ ] Test API rate limiting (Trefle free tier: 120 req/day)
  - [ ] Test fallback when API is down (use local cache)
  - [ ] Test multiple API sources (merge results correctly)

## Critical Files

### Backend Files to Create:
- Migration: `create_plant_varieties_table`
- Migration: `add_plant_variety_id_to_seeds_table`
- `/backend/app/Contracts/PlantDataProvider.php` - Interface
- `/backend/app/Services/PlantProviders/TreflePlantProvider.php`
- `/backend/app/Services/PlantProviders/OpenFarmPlantProvider.php`
- `/backend/app/Services/PlantDataService.php` - Orchestrator
- `/backend/app/Models/PlantVariety.php`
- `/backend/app/Http/Controllers/Plants/PlantSearchController.php`
- `/backend/routes/plants/plant-search-routes.php`

### Backend Files to Modify:
- `/backend/config/services.php` - Add API keys
- `/backend/.env` - Add `TREFLE_API_KEY`
- `/backend/app/Models/Seed.php` - Add relationship to PlantVariety
- `/backend/routes/api.php` - Register plant routes

### Frontend Files to Create:
- `/frontend/src/services/PlantService.js`
- `/frontend/src/components/Plants/PlantSearchAutocomplete.js`
- `/frontend/src/components/Plants/PlantInfoCard.js`

### Frontend Files to Modify:
- `/frontend/src/forms/Seeds/SeedForm.js` - Integrate plant search
- `/frontend/src/pages/inventory/seeds/[id]/index.js` - Display plant info

## Verification Checklist

- [ ] Trefle API provider functional
- [ ] OpenFarm API provider functional (if implemented)
- [ ] Plant search returns results from multiple sources
- [ ] Plants can be saved to local cache
- [ ] Local cache is searched first (performance)
- [ ] PlantSearchAutocomplete component works smoothly
- [ ] Seed form integrates plant search
- [ ] PlantInfoCard displays rich plant information
- [ ] Plant data improves seed inventory usability
- [ ] API rate limits respected (caching works)
- [ ] Fallback to local cache when APIs unavailable
- [ ] All tests pass

## Success Criteria

✅ **Complete when:**
1. Users can search multiple plant databases
2. Plant data is cached locally and shared across tenants
3. Seeds can be linked to plant varieties
4. Rich plant information displayed in seed inventory
5. API integrations are robust with error handling
6. All test cases pass
7. Documentation updated

## Future Enhancements

- Add more plant API providers (USDA, regional databases)
- User contributions (allow verified users to add plants)
- Plant encyclopedia page (browse all cached plants)
- Garden planning with companion planting suggestions
- Planting calendar based on growing zones
- Harvest tracking linked to plant varieties
- Plant care reminders (integrated with Calendar - Issue #10)
- Plant disease/pest identification (image recognition)

## Next Steps After Completion

- Close Issue #25 on GitHub
- Gather user feedback on plant search UX
- Monitor API usage and costs (if using paid tiers)
- Add more plant data sources as needed
- Integrate with garden planning module (future)

## Notes

- Strategy pattern makes it easy to add new plant APIs later
- Caching is critical to avoid hitting API rate limits
- Shared plant database (not tenant-scoped) improves efficiency
- Consider scraping as fallback if APIs are unreliable
- Plant data quality varies by source - Trefle is comprehensive
- OpenFarm is great for food crops, less coverage of ornamentals
- Users may request specific plants not in databases - provide feedback mechanism
- Rich plant data significantly enhances seed inventory value
- Future: Use plant data for AI-powered garden recommendations
