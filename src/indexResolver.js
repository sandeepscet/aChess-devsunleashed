import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
import { storage } from '@forge/api';

const resolver = new Resolver();

resolver.define("getCurrentUserDetails", async ({ payload, context }) => {
  const res = await api.asUser().requestJira(route`/rest/api/3/user?accountId=${context.accountId}`, {
    headers: {
      'Accept': 'application/json',
    }
    });
    const status = res;
    const data = await res.text();
    if(status.status === 200)
    {
      return JSON.parse(data);
    }
    else{
      return {};
    }
});

resolver.define("getIssueDetails", async ({ payload, context }) => {
  const res = await api.asUser().requestJira(route`/rest/api/3/issue/${payload.issueKey}`, {
    headers: {
      'Accept': 'application/json',
    }
    });
    const status = res;
    const data = await res.text();
    if(status.status === 200)
    {
      return JSON.parse(data);
    }
    else{
      return {};
    }
});


resolver.define("jiraIssues", async ({ payload, context }) => {
//  return {};
  const res = await api.asUser().requestJira(route`/rest/api/3/search?jql=${payload.jql}`, {
  headers: {
    'Accept': 'application/json',
  }
  });

    const status = res;
    const data = await res.text();
    return { status, data };
});

resolver.define("userSearchByProject", async ({ payload, context }) => {
    const res = await api.asUser().requestJira(route`/rest/api/3/user/assignable/search?query=${payload.query}&issueKey=${payload.issueKey}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
  
    const status = res;
    const data = await res.text();
    return { status, data };
  });


  resolver.define("createStory", async ({ payload, context }) => {
    console.log({payload});

    var bodyData = `{
      "update": {},
      "fields": {
        "summary": "${payload.title}",
        "parent": {
          "key":  "${payload.parentKey}"
        },
        "issuetype": {
          "id": "${payload.issueType}"
        },
        "project": {
          "id": "${payload.projectKey}"
        },
        "labels": [
          "a-chess"
        ],
        "assignee": {
          "id": "${payload.accountId}"
        }
      }
    }`;

    console.log(bodyData);
    
    const res = await api.asUser().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    });
    
  
    const status = res;
    const data = await res.text();
    return { status, data };
  });







resolver.define("setStorage", async ({ payload }) => {
  storage.set(payload.key, payload.value);
});

resolver.define("getStorage", async ({ payload }) => {
  const res = await storage.get(payload.key);
  return res;
});

resolver.define("deleteStorage", async ({ payload }) => {
  const res = await storage.delete(payload.key);
  return res;
});

export const handler = resolver.getDefinitions();