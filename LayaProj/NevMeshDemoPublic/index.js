/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
var cdn = "https://cdn.jsdelivr.net/gh/lear315/NevMeshJSDemo@1.0/LayaProj/bin/"
loadLib(cdn + "libs/laya.core.js")
loadLib(cdn + "libs/laya.ui.js")
loadLib(cdn + "libs/laya.d3.js")
loadLib(cdn + "libs/laya.physics.js")
loadLib(cdn + "libs/laya.physics3D.js")
loadLib(cdn + "libs/NevMesh.js")
//-----libs-end-------
loadLib(cdn + "js/bundle.js");
