import { Request, Response } from "express";

class ModelNumberController {
  static getAllModelNumber = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const modelNumbers = [
      "AH100 BATTERIE",
      "BATTERIE 150AH",
      "BATTERIE 200AH",
      "BATTERIE 75HT",
      "BATTERIE 250AH",
      "V-9AH GN12 BATTERIE",
      "BATTERIE 6MF5AL",
      "BATTERIE 6MF7E",
      "BATTERIE 6MF9AL",
      "BATTERIE 6MF12AL",
      "BATTERIE 6MF14L",
      "BATTERIE 6MF6.5L",
      "BATTERIE 6MF7A",
      "BATTERIE 6MF19AH",
      "BATTERIE 6MF10AH",
      "BATTERIE 6MF14AH",
      "BATTERIE FUP57AH",
      "BATTERIE FUP9AH",
    ];

    res.status(200).json({ success: true, modelNumbers });
  };
}

export default ModelNumberController;
