import server from '@/utils/request';

export const queryCollector = (data: any) =>
    server.post(`/data-collect/collector/_query/no-paging?paging=false`, data);

export const queryChannelNoPaging = () =>
    server.post(`/data-collect/channel/_query/no-paging?paging=false`, {});

export const save = (data: any) => server.post(`/data-collect/collector`, data);

export const update = (id: string, data: any) =>
    server.put(`/data-collect/collector/${id}`, data);

export const remove = (id: string) =>
    server.remove(`/data-collect/collector/${id}`);

export const queryPoint = (data: any) =>
    server.post(`/data-collect/point/_query`, data);

export const _validateField = (id: string, data?: any) =>
    server.get(`/data-collect/point/${id}/_validate`, data);

export const queryCodecProvider = () => server.get(`/things/collector/codecs`);