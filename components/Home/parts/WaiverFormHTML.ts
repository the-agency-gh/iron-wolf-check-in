export const waiverFormHtml = (signatureString: string) => {
  return `
      <html>
            <head>
            <meta charset="utf-8" />
            </head>
            <style>
                  *{
                  padding:0px;
                  margin:0px;
                  }
                  body{
                  flex:1; 
                  flex-direction:column; 
                  align-items:center; 
                  text-align:center; 
                  row-gap:25px;
                  padding:20px;
                  background-color:white;
                  }
                  h1{
                  font-size:35px;
                  }
                  img{
                        filter:brightness(0);
                  }
            </style>
            <body>
                  <h1>
                  WaiverForm
                  </h1>
                  <p style="align-self:flex-start;">
                        1. The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis
                        and death.
                        <br/>
                        2. I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and unknown,
                        EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASEES or others, and assume full responsibility for
                        my participation.
                        <br/>
                        4. I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin
                        <br/>
                        HEREBY RELEASE, INDEMNIFY, AND HOLD HARMLESS
                        <br/>
                        Iron Wolf Fitness its officers, officials, agents and/or employees, other
                        participants, sponsors, advertisers, and, if applicable, owners and lessors of premises used to conduct the event (RELEASEES), from
                        any and all claims, demands, losses, and liability arising out of or related to any{" "}
                        INJURY, DISABILITY OR DEATH I may suffer, or loss or damage to person or property,
                        WHETHER ARISING FROM THE NEGLIGENCE OF THE RELEASEES OR OTHERWISE, to the fullest extent permitted
                        by law.
                        <br/>
                        Health Statement I will notify
                        Iron Wolf Fitness ownership or employees if I suffer from any medical or health
                        condition that may cause injury to myself, others, or may require emergency care during my participation.
                        <br/>
                        By signing below, I hereby grant and convey to Iron Wolf Fitness all right,
                        title and interest in and to record my name, image, voice, or statements including any and all photographic images and video or
                        audio recordings made by Iron Wolf Fitness
                        <br/>
                        I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP
                        SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.
                        <br/>
                        1. The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis
                        and death.
                        <br/>
                        2. I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and unknown,
                        EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASEES or others, and assume full responsibility for
                        my participation.
                        <br/>
                        4. I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin
                        HEREBY RELEASE, INDEMNIFY, AND HOLD HARMLESS
                        Iron Wolf Fitness its officers, officials, agents and/or employees, other
                        participants, sponsors, advertisers, and, if applicable, owners and lessors of premises used to conduct the event (RELEASEES), from
                        any and all claims, demands, losses, and liability arising out of or related to any{" "}
                        INJURY, DISABILITY OR DEATH I may suffer, or loss or damage to person or property,
                        WHETHER ARISING FROM THE NEGLIGENCE OF THE RELEASEES OR OTHERWISE, to the fullest extent permitted
                        by law.
                        <br/>
                        Health Statement I will notify
                        Iron Wolf Fitness ownership or employees if I suffer from any medical or health
                        condition that may cause injury to myself, others, or may require emergency care during my participation.
                        <br/>
                        By signing below, I hereby grant and convey to Iron Wolf Fitness all right,
                        title and interest in and to record my name, image, voice, or statements including any and all photographic images and video or
                        audio recordings made by Iron Wolf Fitness
                        <br/>
                        I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP
                        SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.
                        <br/>
                        1. The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis
                        and death.
                        <br/>
                        2. I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and unknown,
                        EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASEES or others, and assume full responsibility for
                        my participation.
                        <br/>
                        4. I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin
                        HEREBY RELEASE, INDEMNIFY, AND HOLD HARMLESS
                        <br/>
                        Iron Wolf Fitness its officers, officials, agents and/or employees, other
                        participants, sponsors, advertisers, and, if applicable, owners and lessors of premises used to conduct the event (RELEASEES), from
                        any and all claims, demands, losses, and liability arising out of or related to any{" "}
                        INJURY, DISABILITY OR DEATH I may suffer, or loss or damage to person or property,
                        WHETHER ARISING FROM THE NEGLIGENCE OF THE RELEASEES OR OTHERWISE, to the fullest extent permitted
                        by law.
                        <br/>
                        Health Statement I will notify
                        Iron Wolf Fitness ownership or employees if I suffer from any medical or health
                        condition that may cause injury to myself, others, or may require emergency care during my participation.
                        <br/>
                        By signing below, I hereby grant and convey to Iron Wolf Fitness all right,
                        title and interest in and to record my name, image, voice, or statements including any and all photographic images and video or
                        audio recordings made by Iron Wolf Fitness
                        <br/>
                        I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP
                        SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.
                  </p>
                  <img src="${signatureString}"/>
            </body>
      </html>
      `;
};
