import { Controller, Get, Param, Res, Post } from '@nestjs/common'

import { STATIC } from './environments'

@Controller()
export class AppController {
	@Get(`${STATIC!}/:fileId`)
	getUpload(@Param('fileId') fileId, @Res() res): any {
		return res.sendFile(fileId, {
			root: STATIC!
		})
	}

	@Post('/gitlab')
	postGitlab(@Res() res): any {
		return res.body
	}
}
