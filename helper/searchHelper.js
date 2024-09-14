module.exports = (query) => {
    let objectSearch = {
        keyword: ""
    }

    if(query.keyword){
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword,"i"); // sử dụng regex trong javascript và tham số thứ hai là i là không phân biệt chữ hoa chữ thường
        objectSearch.regex = regex; // monggo hỗ trợ tìm regex
        
    }
    return objectSearch;
}