package querygen.querygen.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import querygen.querygen.service.UserService;

@Controller
public class HomeController {

	Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	UserService userService;

	@RequestMapping(value = { "/", "/index" }, method = RequestMethod.GET)
	public ModelAndView showIndex() throws Exception {
		ModelAndView mv = new ModelAndView("project/index");
		mv.addObject("title", "Index");
		return mv;
	}

	@RequestMapping(value = "/usage", method = RequestMethod.GET)
	public ModelAndView showUsage() throws Exception {
		ModelAndView mv = new ModelAndView("project/usage");
		mv.addObject("title", "Usage");
		return mv;
	}

	@RequestMapping(value = "/schema", method = RequestMethod.GET)
	public ModelAndView showSchema() throws Exception {
		ModelAndView mv = new ModelAndView("project/schema");
		mv.addObject("title", "Schema");
		return mv;
	}

	@RequestMapping(value = "/qna", method = RequestMethod.GET)
	public ModelAndView showQna() throws Exception {
		ModelAndView mv = new ModelAndView("project/qna");
		mv.addObject("title", "Qna");
		return mv;
	}

//	@RequestMapping(value = "/qna", method = RequestMethod.GET)
//	public String qna(Model model) throws Exception {
//		model.addAttribute("title", "Qna");
//		model.addAttribute("msg", "qna ");
//		return "project/index :: #resultDiv";
//	}
}
