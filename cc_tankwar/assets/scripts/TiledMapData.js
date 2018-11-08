
var _tileType = cc.Enum({
    tileNone: 0, 
    tileGrass: 1, 
	tileSteel: 2, 
    tileWall: 3,
	tileRiver: 4, 
    tileKing: 5
});
//gid从1开始
var _gidToTileType = [
	_tileType.tileNone,
	
	_tileType.tileNone, _tileType.tileNone, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileSteel, _tileType.tileSteel, 
	_tileType.tileNone, _tileType.tileNone, _tileType.tileGrass, _tileType.tileGrass, _tileType.tileSteel, _tileType.tileSteel,

	_tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileKing, _tileType.tileKing,
	_tileType.tileWall, _tileType.tileWall, _tileType.tileRiver, _tileType.tileRiver, _tileType.tileKing, _tileType.tileKing,

	_tileType.tileKing, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone,
	_tileType.tileKing, _tileType.tileKing, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone, _tileType.tileNone
];

module.exports = {
    tileType: _tileType,
    gidToTileType: _gidToTileType
};
