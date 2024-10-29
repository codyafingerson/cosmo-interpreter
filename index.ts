import { Scanner } from "./scanner/Scanner";

const scn= new Scanner('create');

scn.scanTokens().forEach(token => {
    console.log(token);
});