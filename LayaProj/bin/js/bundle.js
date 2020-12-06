(function () {
	'use strict';

	class NavMeshAgent extends Laya.Script{
		constructor(){
			super();

			this.navMeshGroup=null;
			this.enabled=false;
			this.updateRotation=false;
			this._pathPending=false;
			//路线进行中
			this._path=null;
			this._pathp=0;
			this._pathlen=0;
			this._remainingDistance=1;
			this.destination=null;
			this.speed=1;
			this.steeringTarget=new Laya.Vector3();
			this._velocity=new Laya.Vector3();
			this.out=new Laya.Vector3();
		}

		onUpdate(){
			if (this.enabled){
				var now=this.owner.transform.position;
				if (this._path){
					var v=new Laya.Vector3;
					var tp=null;
					for (var i=this._pathp;i < this._path.length-1;i++){
						var p0=this._path[i];
						var p1=this._path[i+1];
						this._pathlen=this._pathlen+this.speed/60;
						var tlen=Laya.Vector3.distance(p0,p1);
						if (this._pathlen>tlen){
							this._pathlen-=tlen;
							this._pathp++;
							}else{
							tp=p0.clone();
							p1.cloneTo(this.steeringTarget);
							Laya.Vector3.subtract(p1,p0,v);
							Laya.Vector3.normalize(v,v);
							Laya.Vector3.scale(v,this._pathlen,v);
							Laya.Vector3.add(p0,v,tp);
							break ;
						}
					}
					if (tp==null){
						this._pathPending=false;
						tp=this._path[this._path.length-1];
						this._path[this._path.length-1].cloneTo(this.steeringTarget);
					}
					this.owner.transform.position=tp;
					}else{
					this.out.x=now.x+this.velocity.x *Laya.timer.delta/1000;
					this.out.y=now.y+this.velocity.y *Laya.timer.delta/1000;
					this.out.z=now.z+this.velocity.z *Laya.timer.delta/1000;
					if (this.navMeshGroup==null){
						this.out.cloneTo(now);
						this.owner.transform.position=now;
					}
				}
			}
		}
		get remainingDistance(){
			if (this.destination&&this.owner){
				return Vector3.distance(this.destination,this.owner.transform.position);
			}
			return this._remainingDistance;
		}
		set remainingDistance(value){
			this._remainingDistance=value;
		}

		get velocity(){
			return this._velocity;
		}
		set velocity(value){
			this._velocity=value;
			this.destination=null;
		}

		get path(){
			return this._path;
		}
		set path(value){
			this._path=value;
			if(value){
				this._pathPending=true;
				}else{
				this._pathPending=false;
			}
			this._pathp=0;
			this._pathlen=0;
		}
	}

	class CameraMove extends Laya.Script3D {
	    constructor() {
	        super();
	        /** @private */
	        this._tempVector3 = new Laya.Vector3();
	        this.yawPitchRoll = new Laya.Vector3();
	        this.resultRotation = new Laya.Quaternion();
	        this.tempRotationZ = new Laya.Quaternion();
	        this.tempRotationX = new Laya.Quaternion();
	        this.tempRotationY = new Laya.Quaternion();
	        this.rotaionSpeed = 0.00006;
	    }
	    /**
	     * @private
	     */
	    _updateRotation() {
	        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
	            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
	            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
	            this.camera.transform.localRotation = this.camera.transform.localRotation;
	        }
	    }
	    /**
	     * @inheritDoc
	     */
	    onAwake() {
	        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
	        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
	        //Laya.stage.on(Event.RIGHT_MOUSE_OUT, this, mouseOut);
	        this.camera = this.owner;
	    }
	    /**
	     * @inheritDoc
	     */
	    onUpdate() {
	        let elapsedTime = Laya.timer.delta;
	        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
	            let scene = this.owner.scene;
	            Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime); //W
	            Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime); //S
	            Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime); //A
	            Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime); //D
	            Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime); //Q
	            Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime); //E
	            let offsetX = Laya.stage.mouseX - this.lastMouseX;
	            let offsetY = Laya.stage.mouseY - this.lastMouseY;
	            let yprElem = this.yawPitchRoll;
	            yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
	            yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
	            this._updateRotation();
	        }
	        this.lastMouseX = Laya.stage.mouseX;
	        this.lastMouseY = Laya.stage.mouseY;
	    }
	    /**
	     * @inheritDoc
	     */
	    onDestroy() {
	        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
	        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
	    }
	    mouseDown(e) {
	        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
	        this.lastMouseX = Laya.stage.mouseX;
	        this.lastMouseY = Laya.stage.mouseY;
	        this.isMouseDown = true;
	    }
	    mouseUp(e) {
	        this.isMouseDown = false;
	    }
	    mouseOut(e) {
	        this.isMouseDown = false;
	    }
	    /**
	     * 向前移动。
	     * @param distance 移动距离。
	     */
	    moveForward(distance) {
	        this._tempVector3.x = this._tempVector3.y = 0;
	        this._tempVector3.z = distance;
	        this.camera.transform.translate(this._tempVector3);
	    }
	    /**
	     * 向右移动。
	     * @param distance 移动距离。
	     */
	    moveRight(distance) {
	        this._tempVector3.y = this._tempVector3.z = 0;
	        this._tempVector3.x = distance;
	        this.camera.transform.translate(this._tempVector3);
	    }
	    /**
	     * 向上移动。
	     * @param distance 移动距离。
	     */
	    moveVertical(distance) {
	        this._tempVector3.x = this._tempVector3.z = 0;
	        this._tempVector3.y = distance;
	        this.camera.transform.translate(this._tempVector3, false);
	    }
	}

	/**
	*
	* @ author:Carson
	* @ email:976627526@qq.com
	* @ data: 2019-11-17 12:50
	*/
	class NavTest extends Laya.Script {

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

	/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

	class GameConfig {
	    static init() {
	        //注册Script或者Runtime引用
	        let reg = Laya.ClassUtils.regClass;
			reg("NavMeshAgent/NavTest.js",NavTest);
	    }
	}
	GameConfig.width = 640;
	GameConfig.height = 1136;
	GameConfig.scaleMode ="fixedwidth";
	GameConfig.screenMode = "none";
	GameConfig.alignV = "top";
	GameConfig.alignH = "left";
	GameConfig.startScene = "main.scene";
	GameConfig.sceneRoot = "";
	GameConfig.debug = false;
	GameConfig.stat = false;
	GameConfig.physicsDebug = false;
	GameConfig.exportSceneToJson = true;

	GameConfig.init();

	class Main {
		constructor() {
			//根据IDE设置初始化引擎		
			if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
			else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
			Laya["Physics"] && Laya["Physics"].enable();
			Laya["DebugPanel"] && Laya["DebugPanel"].enable();
			Laya.stage.scaleMode = GameConfig.scaleMode;
			Laya.stage.screenMode = GameConfig.screenMode;
			Laya.stage.alignV = GameConfig.alignV;
			Laya.stage.alignH = GameConfig.alignH;
			//兼容微信不支持加载scene后缀场景
			Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

			//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
			if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
			if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
			if (GameConfig.stat) Laya.Stat.show();
			Laya.alertGlobalError = true;

			//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
			Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
		}

		onVersionLoaded() {
			//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
			Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
		}

		onConfigLoaded() {
			//加载IDE指定的场景
			GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		}
	}
	//激活启动类
	new Main();

}());
