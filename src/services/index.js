export const services = (app) => {
  app.post('/processsubmissionnotification', async (req, res) => {
    const { formId, submissionRefNo, patronAccountNumber, workflowCode, workflowStageCode, workflowActionCode } = req.body;

    if (!formId || !submissionRefNo || !patronAccountNumber || !workflowCode || !workflowStageCode || !workflowActionCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    res.json({
      hdSysBtnState: "show"
    });
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
