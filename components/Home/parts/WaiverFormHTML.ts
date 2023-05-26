import logo from "./Logo";
type SignatureSetProps = {
    applicant: string;
    guardian: string;
};
type FormInfos = {
    applicantName: string;
    fontSize?: number;
};
export const waiverFormHtml = ({ applicant, guardian, applicantName, fontSize = 18 }: SignatureSetProps & FormInfos) => {
    const date = new Date().toISOString().substring(0, 10);
    return `
            <html>
            <style>
                  *{
                  padding:0px;
                  margin:0px;
                  }
                  body{
                  display:flex;
                  flex:1; 
                  flex-direction:column; 
                  background-color:white;
                  line-height:${fontSize + 2}px;
                  }
                  h1{
                  font-size:${fontSize + 4}px;
                  text-align:center;
                  margin-bottom:30px; 
                  }
                  p{
                  font-size: ${fontSize}px;
                  }
                  img{
                  filter:brightness(0);
                  }
                  .signature-section{
                  display:flex;
                  }
                  .signature-box{
                  display:flex;
                  align-items:flex-end;
                  width:75%;
                  }
                  .date-box{
                  display:flex;
                  align-items:flex-end;
                  width:25%;
                  }
                  .signature{
                  display:flex;
                  align-items:flex-end;
                  flex:1;
                  border-bottom:1.5px solid black;
                  height:30px;
                  padding-left:10px;
                  }
                  .text-block{ 
                  margin-bottom:15px;
                  }
                  .date{
                  display:flex;
                  align-items:flex-end;
                  flex:1;
                  border-bottom:1.5px solid black;
                  padding-left:10px;
                  }
                  .signature-image{
                  z-index:1;
                  width:250px;
                  height:70px;
                  object-fit:contain;
                  transform:translateY(20%);
                  
                  }
                  .logo{
                  position:absolute;
                  top:0px;
                  right:0px;
                  width:100px;
                  height:100px;
                  object-fit:cover;
                  }
            </style>
            <body>
                  <!--<img class="logo" src="${logo}" />-->
                  <h1>
                        Iron Wolf Fitness ONE-TIME Daily Pass and Agreement
                  </h1>
                  <b class="text-block">
                        Gym Policies
                  </b>
                  <p class="text-block">
                        <b >1. Disclaimers.</b>
                        <span style="display:block;">Iron Wolf is not responsible for any loss or damage to personal belongings.</span>
                        <span>
                              Applicant must be 18 or older to sign up. If under the age of 18, applicant must get waiver approved by parentor legal guardian and use of their credit and bank information.
                        </span>
                  </p>
                  <p class="text-block">
                        <b>Release and Waiver of Liability and Code of Conduct Conformity</b>
                        <span style="display:block;">In consideration of being permitted to utilize the facilities, services, and programs of Iron Wolf Fitness Studio, but not limited to, observation or use of facilities and equipment and participation in any program, I, on behalf of myself and any children, dependents, or personal representatives, hereby:.</span>
                  </p>
                  <p class="text-block">
                        1. Acknowledge that | have: (a) read this release and waiver of liability; (b) had the opportunity to inspect Iron Wolf Fitness
                        Studio's facilities and equipment or will immediately upon entering or participating and will inspect and carefully consider such
                        premises, facilities, or programs; (c) accept the facilities, equipment, and programs as being safe and reasonably suited for the
                        purposes intended and (d) voluntarily sign this release and waiver of liability.
                  </p>
                  <p class="text-block">
                        2. Release Iron Wolf Fitness Studio, its directors, officers, employees, and volunteers (collectively "gym releases") from all liability to me for any loss or damage to property or injury or death to person, whether caused by the ordinary negligence of the gym's releases or any other person, and while I am in, upon or about any gym equipment therein or participating in any program or service affiliated with the Iron Wolf Fitness Studio.
                  </p>
                  <p>
                        <span>
                              3. Agree not to sue Iron Wolf Fitness Studio Releases for any loss, liability, damage, injury, or death described above and agree to indemnify and hold harmless the gym releases and each of them from any loss, damage or cost they may incur due to my presence in, upon or about gym Facilities or equipment therein or from my participation in any program or service affiliated with Iron Wolf Fitness Studio whether caused by the ordinary negligence of the gym's releases or by any other person. I assume full responsibility for the risk of such loss, liability, damage, injury, or death.
                        </span>
                        <br/>
                        <span>
                              I intend for this release and waiver of liability to be as broad and inclusive as is permitted by the laws of the State of Illinois. If any portion hereof is held invalid, I agree that the balance shall continue in full force and effect. I hereby state that I am joining this fitness studio of my own volition and that I have not been solicited or pressured to join in anyway whatsoever.
                        </span>
                        <br/>
                        <span>
                              In addition, I have read the attached Code of Conduct conditions and I agree to be legally obligated to confrom with all rules of the Iron Wolf fitness. 
                        </span>
                  </p>
                  
                  <div style="margin-top:50px;" class ="signature-section">
                        <div class ="signature-box">
                              <p>
                                    Applicant Signature:
                              </p>
                              <div class='signature'>
                                    <img class='signature-image' src="${applicant}">
                              </div>
                        </div>
                        <div class ="date-box">
                              <p>
                                    Date:
                              </p>
                              <div class='date'>
                                    <p>
                                          ${date}
                                    </p>
                              </div>
                        </div>
                  </div>
                  <div class ="signature-section">
                        <div class ="signature-box">
                              <p>
                                    Applicant Printed Name:
                              </p>
                              <div class='signature'>
                                    <p>
                                          ${applicantName}
                                    </p>
                              </div>
                        </div>
                        <div class ="date-box">
                              <p>
                                    Date:
                              </p>
                              <div class='date'>
                                    <p>
                                          ${date}
                                    </p>
                              </div>
                        </div>
                  </div>
                  <div class ="signature-section">
                        <div class ="signature-box">
                              <p>
                                    Parents/Guardians Signature (if under 18):
                              </p>
                              <div class='signature'>
                                    ${guardian ? `<img class='signature-image' src="${guardian}">` : ""}
                              </div>
                        </div>
                        <div class ="date-box">
                              <p>
                                    Date:
                              </p>
                              <div class='date'>
                                    <p>
                                    ${guardian ? date : ""}
                                    </p>
                              </div>
                        </div>
                  </div>
            </body>
            </html>
      `;
};
