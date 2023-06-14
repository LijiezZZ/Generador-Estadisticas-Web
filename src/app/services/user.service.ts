import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState, User as Usuario, deleteUser, updateEmail, updatePassword } from '@angular/fire/auth';
//import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Firestore, collection, addDoc, query, where, collectionData, getDocs, doc, orderBy, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map, NextObserver, Observable, of as observableOf} from 'rxjs';
import { User } from '../_models/user.model';
import { Chart as Chartjs } from 'chart.js/auto';
import { Chart } from '../_models/chart.model'


@Injectable({
    providedIn: 'root'
  })
export class UserService {

    userData: any;

    authState$ = authState(this.auth);

    constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
        this.authState$.subscribe((aUser: Usuario | null) => {
            if (aUser) {
                this.userData = aUser;
                console.log("hay usuario", aUser);
                localStorage.setItem("user", JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem("user")!);
            }
            else {
                console.log("no hay usuario", aUser);
                localStorage.clear();
                localStorage.setItem("user", "null");
                localStorage.setItem("userInfo", "null");
                JSON.parse(localStorage.getItem("user")!);
                JSON.parse(localStorage.getItem("userInfo")!);
            }
        })
    }

    //authState$: Observable<firebase.default.User | null> = this.afAuth.authState;

    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password).then((response) => {
            this.getUserFromDB(email).subscribe((user) => {
                if (localStorage.getItem("user") != "null") {
                  localStorage.setItem("userInfo", JSON.stringify({"uid":user[0]["uid"], "username":user[0]["username"], "charts":user[0]["charts"], "type":user[0]["type"], "active":user[0]["active"]}));
                  JSON.parse(localStorage.getItem("userInfo")!);
                }
                else {
                  localStorage.setItem("userInfo", "null");
                  JSON.parse(localStorage.getItem("userInfo")!);
                }
              })
        });
    }

    register(username: string, email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }


    logout() {
        signOut(this.auth).then(() => {
            this.getUserFromDB("null").subscribe((user) => {
                localStorage.setItem("userInfo", "null");
                JSON.parse(localStorage.getItem("userInfo")!);
              })
            this.router.navigate(["/"]);
        })
    }

    updateEmail(uid: string, email: string) {
        updateEmail(this.auth.currentUser!, email).then(() => {
            this.updateUserFromDB(uid, "email", email);
        });
    }

    updatePassword(uid: string, password: string) {
        updatePassword(this.auth.currentUser!, password).then(() => {
            this.updateUserFromDB(uid, "password", password);
        })
    }

    registerUserToDB(user: User) {
        const userRef = collection(this.firestore, "users");
        addDoc(userRef, user);
    }

    getUserFromDB(email: string) {
        const userRef = collection(this.firestore, "users");
        let response = query(userRef, where("email", "==", email));
        return collectionData(response);
    }

    getAllUsersFromDB() {
        const usersRef = collection(this.firestore, "users");
        let response = query(usersRef, where("type", "!=", "admin"));
        return collectionData(response);
    }

    async updateUserFromDB(uid: string, field: string, param: any) {
        const userRef = collection(this.firestore, "users");
        let q = query(userRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (field == "charts") {
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'users', document.id);
                await updateDoc(docRef, {"charts": param});
            })
        }

        if (field == "active") {
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'users', document.id);
                await updateDoc(docRef, {"active": param});
            })
        }

        if (field == "type") {
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'users', document.id);
                await updateDoc(docRef, {"type": param});
            })
        }

        if (field == "email") {
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'users', document.id);
                await updateDoc(docRef, {"email": param});
            })
        }

        if (field == "username") {
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'users', document.id);
                await updateDoc(docRef, {"username": param});
            })
        }

        if (field == "password") {
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'users', document.id);
                await updateDoc(docRef, {"password": param});
            })
        }
    }

    async deleteUserFromDB(uid: string) {
        this.deleteChart(uid, "");
        const userRef = collection(this.firestore, "users");
        let q = query(userRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
            const docRef = doc(this.firestore, 'users', document.id);
            await deleteDoc(docRef);
        })
    }

    createChart(canvasName: string, chartData: any) {
        let h_bar = chartData["type"] == "h_bar"? true : false;
        let s_bar = chartData["type"] == "s_bar"? true : false;

        let dataY = this.parseDataY(chartData);
        let plugin: any = {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart: Chartjs) => {
                const {ctx} = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = chartData["bgColor"] || 'transparent';
                ctx.fillRect(0, 0, chart.width, chart.height);  
                ctx.restore();
            }
        }

        let chart = new Chartjs(canvasName, {
            type: chartData["type"], //this denotes tha type of chart
            data: {// values on X-Axis
              labels: chartData["dataX"], 
                 datasets: dataY,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: h_bar? "y" : "x",
                scales: {
                    x: {
                        stacked: s_bar,
                        title: {
                            display: true,
                            text: chartData["titleX"],
                        },
                        ticks: {
                            font: {
                              style: chartData["labelFontStyle"],
                              weight: chartData["labelFontWeight"],
                            },
                        },
                    },
                    y: {
                        stacked: s_bar,
                        title: {
                            display: true,
                            text: chartData["titleY"],
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: chartData["title"],
                        font: {
                            size: 18,
                            style: chartData["titleFontStyle"],
                            weight: chartData["titleFontWeight"],
                        }
                    },
                    subtitle: {
                        display: true,
                        text: chartData["subtitle"],
                        font: {
                            size: 12,
                            style: chartData["subtitleFontStyle"],
                            weight: chartData["subtitleFontWeight"],
                        }
                    }
                }
            },
            plugins: [plugin],
          });
    } 

    parseDataY(chartData: any) {
        let bgColors = ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(153, 102, 255, 0.2)'];
        let borderColors = ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 159, 64)', 'rgb(153, 102, 255)'];
        let dataY = [];
        for (let i = 0; i < chartData["dataY"].length; i++) {
          dataY.push({
            label: chartData["legends"] != undefined? chartData["legends"][i] : "",
            data: chartData["dataY"][i],
            pointRadius: chartData["type"] == "s_line"? 0 : 3,
            fill: chartData["type"] == "area"? true : false,
            backgroundColors: bgColors[i],
            borderColors: borderColors[i],
            borderWidth: 2,
            stepped: chartData["type"] == "s_line"? true : false,
          });
        }
        chartData["type"] = chartData["type"] == "area" ? "line" : chartData["type"];
        chartData["type"] = chartData["type"] == "h_bar"? "bar" : chartData["type"];
        chartData["type"] = chartData["type"] == "s_bar"? "bar" : chartData["type"];
        chartData["type"] = chartData["type"] == "s_line"? "line" : chartData["type"];
        return dataY;
      }

    registerChartToDB(chartData: Chart) {
        const chartRef = collection(this.firestore, "charts");
        addDoc(chartRef, chartData);
    }

    getChartFromDB(uid: string, order: any) {
        const chartRef = collection(this.firestore, "charts");
        let response = query(chartRef, where("uid", "==", uid), orderBy("date", order));
        return collectionData(response);
    }

    async updateChartToDB(uid: string, chartData: any) {
        const chartRef = collection(this.firestore, "charts");
        let q = query(chartRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
            const docRef = doc(this.firestore, 'charts', document.id);
            await updateDoc(docRef, { ...chartData});
        })
    }

    async deleteChart(uid: string, chartid: string) {
        const chartRef = collection(this.firestore, "charts");
        if (chartid != "") {
            let q = query(chartRef, where("uid", "==", uid), where("chartid", "==", chartid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'charts', document.id);
                await deleteDoc(docRef);
            })
        }
        else {
            let q = query(chartRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (document) => {
                const docRef = doc(this.firestore, 'charts', document.id);
                await deleteDoc(docRef);
            })
        }
    }
    
}