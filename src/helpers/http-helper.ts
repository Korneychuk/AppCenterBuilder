import * as https from 'https'; 
 
export interface IResponse { 
    status?: number; 
    body?: string; 
} 
 
export const makeRequest = (options: https.RequestOptions, body: string = ''): Promise<IResponse> => { 
    return new Promise((resolve, reject) => { 
        const request = https.request(options, (response) => { 
            let data = ''; 
            let status = response.statusCode; 
            response.on('data', (chunk) => { 
                data += chunk; 
            }); 
 
            response.on('end', () => { 
                resolve(<IResponse>{ status: status, body: data }); 
            }); 
        }); 
 
        request.on('error', (error) => { 
            reject(error); 
        }); 
 
        request.on('timeout', () => { 
            request.abort(); 
        }); 
 
        request.end(body); 
    }); 
}