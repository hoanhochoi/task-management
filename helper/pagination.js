module.exports = (objectPagination,query,countRecord) => {
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    if(query.limit){
        objectPagination.limitItems = parseInt(query.limit);
    }
// công thức :
// vị trí bắt đầu lấy = (số trang - 1) * số lượng phần tử mỗi trang
    objectPagination.skip = ( objectPagination.currentPage - 1) * objectPagination.limitItems;


    // đếm số lượng sản phẩm
   
    const totalPage = Math.ceil(countRecord / objectPagination.limitItems);
    // Math.ceil để làm tròn số lên một đơn vị ví dụ 4.1 = 5
    objectPagination.totalPage = totalPage;
//    console.log(objectPagination)
    return objectPagination;
}