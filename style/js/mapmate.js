class Mapmate {


    /**
     * 构造函数
     *
     * @param ele 元素ID
     * @param options 入参
     */
    constructor(ele, options) {
        this.mapContainer = document.getElementById(ele);
        this.options = options;
        this.maps = {};
    }


    addMap(type, options) {
        let map;
        switch (type) {
            case 'Google':
                map = new google.maps.Map(this.mapContainer, options);
                break;
            case 'Baidu':
                options = Object.assign(options, {enableMapClick: false});
                // 百度地图API对谷歌地图API的命名法有点不同
                map = new BMap.Map(this.mapContainer, options);
                break;
            default:
                console.error(`MultiMap: unknown map type, ${type}`);
                return;
        }
        this.addMapEvents(type, map);
        this.maps[type] = map;
    }

    removeMap(type) {
        if (type in this.maps) {
            this.removeMapEvents(type, this.maps[type]);
            delete this.maps[type];
        }
    }

    addMarker(type, lat, lng, options) {
        let marker;
        switch (type) {
            case 'Google':
                marker = new google.maps.Marker(Object.assign({
                    position: {lat, lng},
                    map: this.maps.Google
                }, options));
                break;
            case 'Baidu':
                marker = new BMap.Marker(new BMap.Point(lng, lat), options);
                this.maps.Baidu.addOverlay(marker);
                break;
            default:
                console.error(`MultiMap: unknown map type, ${type}`);
                return;
        }
        return marker;
    }

    removeMarker(type, marker) {
        switch (type) {
            case 'Google':
                marker.setMap(null);
                break;
            case 'Baidu':
                this.maps.Baidu.removeOverlay(marker);
                break;
            default:
                console.error(`MultiMap: unknown map type, ${type}`);
        }
    }

    addPolyline(type, path, options) {
        let polyline;
        switch (type) {
            case 'Google':
                polyline = new google.maps.Polyline(Object.assign({
                    path,
                    map: this.maps.Google
                }, options));
                break;
            case 'Baidu':
                const points = path.map(lnglat => new BMap.Point(lnglat[1], lnglat[0]));
                polyline = new BMap.Polyline(points, options);
                this.maps.Baidu.addOverlay(polyline);
                break;
            default:
                console.error(`MultiMap: unknown map type, ${type}`);
                return;
        }
        return polyline;
    }

    removePolyline(type, polyline) {
        switch (type) {
            case 'Google':
                polyline.setMap(null);
                break;
            case 'Baidu':
                this.maps.Baidu.removeOverlay(polyline);
                break;
            default:
                console.error(`MultiMap: unknown map type, ${type}`);
        }
    }

    setZoom(type, level) {
        switch (type) {
            case 'Google':
                this.maps.Google.setZoom(level);
                break;
            case 'Baidu':
                this.maps.Baidu.setZoom(level);
                break;
            default:
                console.error(`MultiMap: unknown map type, ${type}`);
        }
    }

    getMap(type) {
        return this.maps[type];
    }

    addMapEvents(type, map) {
        switch (type) {
            case 'Google':
                google.maps.event.addListener(map, 'click', event => {
                    this.onMapClick(type, event);
                });
                break;
            case 'Baidu':
                map.addEventListener('click', event => {
                    this.onMapClick(type, event);
                });
                break;
        }
    }

    removeMapEvents(type, map) {
        switch (type) {
            case 'Google':
                google.maps.event.clearListeners(map, 'click');
                break;
            case 'Baidu':
                map.removeEventListener('click', event => {
                    this.onMapClick(type, event);
                });
                break;
        }
    }

    onMapClick(type, event) {
        console.log(`MultiMap: map ${type} clicked at (${event.latLng.lat()}, ${event.latLng.lng()})`);
    }

    static get GOOGLE_MAP_TYPE() {
        return 'Google';
    }

    static get BAIDU_MAP_TYPE() {
        return 'Baidu';
    }



}