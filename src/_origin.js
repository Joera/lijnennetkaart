class Origin {

    constructor(map, config) {

        this._map = map;
        this._config = config;
    }

    loadData(origin) {

        this._map.addSource('points', {
            type: 'geojson',
            data: 'features/features_Amstelland_Station_Hoofddorp.json'
        });

    }
}