import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Link } from 'src/database/models/link.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(Link)
    private linkModel: typeof Link,
  ) {}

  async createLink(
    session_key: string,
    name: string,
    url: string,
  ): Promise<Link> {
    const code = uuidv4();

    const link = await this.linkModel.create({
      session_key,
      name,
      url,
      code,
    });

    return link;
  }

  async getLinkByCode(code: string): Promise<Link> {
    return this.linkModel.findOne({
      where: { code },
      raw: true,
    });
  }

  async getAllLinksForSession(
    session_key: string,
    page: number,
    pageSize: number = 5,
  ): Promise<{ links: Link[]; totalPages: number }> {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await this.linkModel.findAndCountAll({
      where: { session_key },
      limit: pageSize,
      offset,
      raw: true,
    });

    const totalPages = Math.ceil(count / pageSize);

    return {
      links: rows,
      totalPages,
    };
  }

  async deleteLinkByCode(code: string): Promise<number> {
    const result = await this.linkModel.destroy({
      where: { code },
    });
    return result;
  }
}
