import React from "react";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";

declare const window: any;

export default class ProfileSetting extends React.Component {
  state={name:ConfigService.getReaderConfig("profileDisplayName")||"",picture:ConfigService.getReaderConfig("profilePicturePath")||"",verse:ConfigService.getReaderConfig("profileVerse")||""};
  save=(key:string,value:string)=>ConfigService.setReaderConfig(key,value);
  pick=async()=>{const {ipcRenderer}=window.require("electron");const picture=await ipcRenderer.invoke("select-file",{filters:[{name:"Images",extensions:["png","jpg","jpeg","webp"]}]});if(picture){this.save("profilePicturePath",picture);this.setState({picture});}};
  render(){return <><div className="setting-dialog-new-title"><span>Display Name</span><input className="lang-setting-dropdown" value={this.state.name} maxLength={80} onChange={e=>{this.save("profileDisplayName",e.target.value);this.setState({name:e.target.value});}}/></div><div className="setting-dialog-new-title"><span>Profile Picture</span><span className="change-location-button" onClick={this.pick}>{this.state.picture?"Change...":"Browse..."}</span></div><div className="setting-dialog-new-title" style={{alignItems:"flex-start"}}><span>Verse</span><textarea className="lang-setting-dropdown" style={{width:180,height:110,resize:"vertical"}} maxLength={250} value={this.state.verse} onChange={e=>{this.save("profileVerse",e.target.value);this.setState({verse:e.target.value});}} /></div></>}
}
