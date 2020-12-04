export default class NavMeshAgent extends Laya.Script{
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