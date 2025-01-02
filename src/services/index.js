import axios from 'axios';
export const services = (app) => {


  app.post('/processsubmissionnotification', async (req, res) => {
    const {
      FormId: formId,
      RefNo: submissionRefNo,
      PatronAccountNumber: patronAccountNumber,
      WorkflowCode: workflowCode,
      WorkflowStageCode: workflowStageCode,
      WorkflowActionCode: workflowActionCode
    } = req.body;

    console.log(formId, submissionRefNo, patronAccountNumber, workflowCode, workflowStageCode, workflowActionCode)

    try {
      // Step 1: Get the access token
      const tokenPayload = new URLSearchParams();
      tokenPayload.append('ClientId', 'mySecret'); // Replace with your actual Client ID
      tokenPayload.append('ClientSecret', 'mySecret'); // Replace with your actual Client Secret

      const tokenResponse = await axios.post('https://qa3.kube365.com/graph.api/v1.0/token', tokenPayload, {

      });

      const { access_token } = tokenResponse.data; // Extract the access token

      const updateSubmissionPayload = {
        IsDraft: false,
        Fields: [
          {
            FieldCode: "hdSysBtnState",
            Value: {
              "values": ["show"]
            }
          }
        ]
      };


      console.log(formId, submissionRefNo, updateSubmissionPayload)

      // Step 3: Call the Update Submission Data API
      const updateApiResponse = await axios.post(
        `https://qa3.kube365.com/graph.api/v1.0/Submission/(${formId})/${submissionRefNo}`,
        updateSubmissionPayload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`, // Use the access token in the Authorization header


          }
        }
      );

      console.log(updateApiResponse.data)


      // Step 2: Prepare the payload for the external API call
      const submissionPayload = {
        formId: formId, // From request body
        submissionRef: submissionRefNo, // From request body
        workflowCode: workflowCode, // Fixed or dynamic value
        workflowStageCode: workflowStageCode, // Fixed or dynamic value
        workflowActionCode: workflowActionCode, // Fixed or dynamic value
        comment: 'System move workflow', // Fixed value
        actionFor: ['spadmin@kube.com'], // Fixed array
        fields: [
          {
            FieldCode: "Comment",
            Value: {
              Value: '' // Fixed empty string or dynamic value
            }
          }
        ]
      };

      // Step 3: Make the external API call with the access token
      const apiResponse = await axios.post(
        `https://qa3.kube365.com/graph.api/v1.0/Submission/(${formId})/${submissionRefNo}/MoveStage`,
        submissionPayload,
        {
          headers: {
            Authorization: `Bearer ${access_token}` // Use the access token in the Authorization header
          }
        }
      );

      const { data } = apiResponse; // Process the API response as needed

      // Return the response to the client
      res.json({
        hdSysBtnState: "show",
        // externalApiResponse: data // Include the external API response if needed
      });
    } catch (error) {
      console.error('Error while calling external APIs:', error.message);
      res.status(500).json({ error: 'Failed to process the request', details: error.message });
    }
  });


  app.post('/frontmoneydeposit', async (req, res) => {
    const { patronNumber, amount } = req.body;

    if (!patronNumber || !amount) {
      return res.status(400).json({ error: 'Patron number and amount are required' });
    }

    const timestamp = new Date().toISOString();

    res.status(200).json({
      response: {
        resultStatus: "Transaction Okay",
        system: "FrontMoneyDeposit",
        TransactionType: "KI",
        MessageID: "928",
        DeviceID: "PL360",
        TimeStamp: timestamp,
        CorporateID: "S",
        PropertyID: "A",
        PatronNumber: patronNumber,
        ReferenceTransaction: "12345",
        ResponseCode: "200",
        ResponseCodeDescription: "Transaction Okay"
      }
    });
  });

  app.post('/frontmoneydepositfail', async (req, res) => {
    const { patronNumber, amount } = req.body;

    if (!patronNumber || !amount) {
      return res.status(400).json({ error: 'Patron number and amount are required' });
    }

    const timestamp = new Date().toISOString();

    res.status(500).json({
      response: {
        resultStatus: "Failed",
        system: "FrontMoneyDeposit",
        TransactionType: "KI",
        MessageID: "928",
        DeviceID: "PL360",
        TimeStamp: timestamp,
        CorporateID: "S",
        PropertyID: "A",
        PatronNumber: patronNumber,
        ReferenceTransaction: "12345",
        ResponseCode: "500",
        ResponseCodeDescription: "Failed"
      }
    });
  });

  app.post('/sendsmssuccess', async (req, res) => {
    const { smsPhoneNum, smsContent } = req.body;

    if (!smsPhoneNum || !smsContent) {
      return res.status(400).json({ error: 'Phone number and SMS content are required' });
    }

    res.json({
      txtSendSMSStatus: "true"
    });
  });

  app.post('/sendsmsfail', async (req, res) => {
    const { smsPhoneNum, smsContent } = req.body;

    if (!smsPhoneNum || !smsContent) {
      return res.status(400).json({ error: 'Phone number and SMS content are required' });
    }

    res.json({
      txtSendSMSStatus: "false"
    });
  });
}
