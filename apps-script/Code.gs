const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const SHEET_NAME = 'Leads';
const EXPECTED_HEADERS = ['data e hora', 'nome', 'whatsapp', 'cidade', 'faturamento mensal', 'pedidos mensais', 'ticket informado', 'ticket calculado', 'gargalos identificados', 'recomendações', 'consentimento', 'origem/utm', 'versão da página', 'status do follow-up', 'observações'];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const expectedToken = PropertiesService.getScriptProperties().getProperty('LEAD_TOKEN');
    if (!expectedToken || payload.token !== expectedToken) return json({ ok: false, error: 'unauthorized' });
    if (!payload.name || !payload.whatsapp || !payload.city || !payload.consent) return json({ ok: false, error: 'invalid_payload' });
    const sheet = getSheet_();
    sheet.appendRow([new Date(), payload.name, payload.whatsapp, payload.city, payload.monthlyRevenue, payload.monthlyOrders, payload.averageTicket, payload.diagnostic?.estimatedTicket || '', (payload.diagnostic?.items || []).map(item => item.title).join(' | '), (payload.diagnostic?.items || []).map(item => item.action).join(' | '), payload.consent ? 'sim' : 'não', formatAttribution_(payload), payload.pageVersion || 'v1', 'novo', '']);
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(EXPECTED_HEADERS);
  return sheet;
}

function formatAttribution_(payload) {
  return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(key => key + '=' + (payload[key] || '')).join('&');
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
