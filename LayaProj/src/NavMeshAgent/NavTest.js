import NavMeshAgent from "./NavMeshAgent";
import CameraMove from "./CameraMove";

/**
*
* @ author:Carson
* @ email:976627526@qq.com
* @ data: 2019-11-17 12:50
*/
export default class NavTest extends Laya.Script {

    constructor() {
        super();
    }
    onAwake(){
        Laya.Scene3D.load("res/scene/LayaScene_LayaNavMesh/Conventional/LayaNavMesh.ls",Laya.Handler
	.create(this,this.onSceneLoadFinish));
	
		//创建射线
		this.ray=new Laya.Ray(new Laya.Vector3(),new Laya.Vector3());
		//射线检测结果
		this.hitResult=new Laya.HitResult(); 
    }
    onSceneLoadFinish(sceneLoad){
        Laya.stage.addChild(sceneLoad);
		sceneLoad.zOrder=-1;
		this.scene=sceneLoad;
        this.player=sceneLoad.getChildByName("player");
		this.physicsSimulation=sceneLoad.physicsSimulation;

		this.navUrl="meshes/outfile.json";
		this.camera= sceneLoad.getChildByName("Main Camera");
		this.agent=null;
		this.agent=this.player.addComponent(NavMeshAgent);
		this.agent.speed=10;
		
		this.camera.addComponent(CameraMove);
        
		Laya.loader.load(this.navUrl,Laya.Handler.create(this,this.onNavLoaded),null,"json");
	}

	onUpdate() {

        if (Laya.KeyBoardManager.hasKeyDown(79)) {
			this.camera.removeSelf();
			this.camera.transform.localPosition = new Laya.Vector3(0,3,-5);
			this.camera.transform.localRotationEuler = new Laya.Vector3(0,-180,0);
			this.player.addChild(this.camera);
		}

		if (Laya.KeyBoardManager.hasKeyDown(80)) {
			this.camera.removeSelf();
			this.camera.transform.localPosition = new Laya.Vector3(0,79,0);
			this.camera.transform.localRotationEuler = new Laya.Vector3(-90,180,0);
			this.player.parent.addChild(this.camera);
		}

    }

	onNavLoaded(){
		var json=Laya.loader.getRes(this.navUrl);
        let zoneNodes =  NevMesh.buildNodesByJson(json);
        NevMesh.setZoneData('game',zoneNodes);
		this.playerNavMeshGroup = NevMesh.getGroup('game', this.player.transform.position);
		Laya.stage.on("click",this,this.onClick);
	}

	onClick(){
		//将屏幕坐标转化为射线
        this.camera.viewportPointToRay(new Laya.Vector2(Laya.stage.mouseX,Laya.stage.mouseY),this.ray);
        if(this.physicsSimulation.rayCast(this.ray,this.hitResult)){
			console.log("000");
			this.targetPos=this.hitResult.point;
			let calculatedPath = NevMesh.findPath(this.player.transform.position,this.targetPos, 'game',this.playerNavMeshGroup);

			if (calculatedPath && calculatedPath.length){
				var debugPath=(calculatedPath);
				console.log("start",this.player.transform.position.x,this.player.transform.position.y,this.player.transform.position.z);
				var p=[];
				for (var i=0;i < debugPath.length;i++){
					console.log(debugPath[i].x,debugPath[i].y,debugPath[i].z);
					p.push(new Laya.Vector3(debugPath[i].x,debugPath[i].y+.1,debugPath[i].z));
				}
				
				this.agent.path=[this.player.transform.position].concat(p);
				this.agent.enabled=true;
				console.log("end",this.targetPos.x,this.targetPos.y,this.targetPos.z);
			}
			else{
				this.agent.enabled=false;
			}
		}
	}
}