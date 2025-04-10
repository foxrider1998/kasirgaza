import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";
import { categoryValidation } from "../validations/category.validation.js";

import { startOfDay, endOfDay } from 'date-fns';

// export const getSalesByCategory = async (req, res) => {
//   try {
//     const todayStart = startOfDay(new Date());
//     const todayEnd = endOfDay(new Date());
//  let id =1
//     const result = await prisma.category.findMany({
//       select: {
//         id: true,
//         kategoryName: true,
//         Product: {
//           select: {
//             Orderdetail: {
//               where: {
//                 order: {
//                   date: {
//                     gte: todayStart,
//                     lte: todayEnd
//                   }
//                 }
//               },
//               select: {
//                 qty: true,
//                 price: true,
//               }
//             }
//           }
//         }
//       }
//     });

//     const formatted = result.map(category => {
//       let laku = 0;
//       let seharga = 0;

//       category.Product.forEach(product => {
//         product.Orderdetail.forEach(order => {
//           laku += order.qty;
//           seharga += Number(order.price) * order.qty;
//         });
//       });

//       return {
//         id: category.id,
//         kategoryName: category.kategoryName,
//         laku,
//         seharga,
//         hargaSatuan: laku > 0 ? Math.round(seharga / laku) : 0
//       };
//     });

//     res.status(200).json(formatted);
//   } catch (error) {
//     logger.error("controllers/kategory.controller.js:getSalesByCategory - " + error.message);
//     res.status(500).json({
//       message: "Server error",
//       result: null
//     });
//   }
// };

export const getSalesByCategory = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // Default: hari ini
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const start = startDate ? startOfDay(new Date(startDate)) : todayStart;
    const end = endDate ? endOfDay(new Date(endDate)) : todayEnd;

    const result = await prisma.category.findMany({
      select: {
        id: true,
        kategoryName: true,
        Product: {
          select: {
            productName: true, // ← tambahin ini buat tahu nama produk
            Orderdetail: {
              where: {
                order: {
                  date: {
                    gte: start,
                    lte: end
                  }
                }
              },
              select: {
                productName:true,
                qty: true,
                price: true,
              }
            }
          }
        }
      }
    });

    const formatted = result.map(category => {
      let laku = 0;
      let seharga = 0;

      const products = category.Product.map(product => {
        let totalQty = 0;
        let totalPrice = 0;

        product.Orderdetail.forEach(order => {
          totalQty += order.qty;
          totalPrice += Number(order.price) * order.qty;
        });

        laku += totalQty;
        seharga += totalPrice;

        return totalQty > 0
          ? {
              productName: product.productName,
              qty: totalQty,
              totalPrice,
            }
          : null;
      }).filter(Boolean); // Buang produk yang gak ada penjualan

      return {
        id: category.id,
        kategoryName: category.kategoryName,
        laku,
        seharga,
        hargaSatuan: laku > 0 ? Math.round(seharga / laku) : 0,
        products, // ← tambahin ke response
      };
    });

    res.status(200).json({ result: formatted });
  } catch (error) {
    logger.error("controllers/kategory.controller.js:getSalesByCategory - " + error.message);
    res.status(500).json({
      message: "Server error",
      result: null
    });
  }
};




export const getAllCategory = async (req, res) => {
  try {
    const result = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/kategory.controller.js:getAllCategory - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};


export const getCategoryById = async (req, res) => {
  try {
    const result = await prisma.category.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/kategory.controller.js:getCategoryById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const createCategory = async (req, res) => {
  const { error, value } = categoryValidation(req.body);
  if (error != null) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.category.create({
      data: {
        kategoryName: value.kategoryName,
      },
    });
    return res.status(200).json({
      message: "Data kategori berhasil ditambah!",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/kategory.controller.js:createCategory - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { error, value } = categoryValidation(req.body);
  if (error != null) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        kategoryName: value.kategoryName,
      },
    });
    return res.status(200).json({
      message: "Data kategori berhasil diubah!",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/kategory.controller.js:updateCategory - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const result = await prisma.category.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json({
      message: "Data kategori berhasil dihapus!",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/kategory.controller.js:deleteCategory - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};